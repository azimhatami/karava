const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const { WalletModel } = require("../app/models/wallet");
const { WalletTransactionModel } = require("../app/models/walletTransaction");
const { ProjectModel } = require("../app/models/project");

const MIN_DEPOSIT_AMOUNT = 10_000;
const MAX_DEPOSIT_AMOUNT = 200_000_000;

const TX_TYPES = Object.freeze({
  DEPOSIT: "deposit",
  HOLD: "hold",
  RELEASE: "release",
  REFUND: "refund",
});

function sessionOpts(session) {
  return session ? { session } : {};
}

function topologySupportsTransactions() {
  const type = mongoose.connection?.client?.topology?.description?.type;
  return (
    type === "ReplicaSetWithPrimary" ||
    type === "Sharded" ||
    type === "LoadBalanced"
  );
}

async function runWalletOp(work) {
  if (!topologySupportsTransactions()) {
    return work(null);
  }

  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
  } catch {
    if (session) {
      try {
        session.endSession();
      } catch (_) {
        /* ignore */
      }
    }
    return work(null);
  }

  try {
    const result = await work(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch (_) {
      /* ignore */
    }
    throw err;
  } finally {
    session.endSession();
  }
}

async function createDocs(Model, docs, session) {
  if (session) {
    return Model.create(docs, { session });
  }
  return Model.create(docs);
}

async function getOrCreateWallet(userId, session = null) {
  const query = WalletModel.findOne({ user: userId });
  if (session) query.session(session);
  let wallet = await query;
  if (wallet) return wallet;

  try {
    const created = await createDocs(
      WalletModel,
      [{ user: userId, balance: 0, heldBalance: 0 }],
      session
    );
    return Array.isArray(created) ? created[0] : created;
  } catch (err) {
    if (err?.code === 11000) {
      const retry = WalletModel.findOne({ user: userId });
      if (session) retry.session(session);
      return retry;
    }
    throw err;
  }
}

function insufficientFundsError() {
  const err = createHttpError.BadRequest(
    "موجودی کیف پول کافی نیست، لطفاً شارژ کنید"
  );
  err.code = "INSUFFICIENT_WALLET_BALANCE";
  return err;
}

async function deposit({ userId, amount }) {
  if (!Number.isFinite(amount) || amount < MIN_DEPOSIT_AMOUNT) {
    throw createHttpError.BadRequest(
      `حداقل مبلغ شارژ ${MIN_DEPOSIT_AMOUNT.toLocaleString("fa-IR")} تومان است`
    );
  }
  if (amount > MAX_DEPOSIT_AMOUNT) {
    throw createHttpError.BadRequest(
      `سقف هر بار شارژ آزمایشی ${MAX_DEPOSIT_AMOUNT.toLocaleString("fa-IR")} تومان است`
    );
  }
  const rounded = Math.round(amount);

  return runWalletOp(async (session) => {
    const wallet = await getOrCreateWallet(userId, session);
    const updated = await WalletModel.findOneAndUpdate(
      { _id: wallet._id },
      { $inc: { balance: rounded } },
      { new: true, ...sessionOpts(session) }
    );
    const [transaction] = await createDocs(
      WalletTransactionModel,
      [
        {
          wallet: updated._id,
          type: TX_TYPES.DEPOSIT,
          amount: rounded,
          description: "شارژ آزمایشی کیف پول (بدون درگاه پرداخت)",
        },
      ],
      session
    );
    return { wallet: updated, transaction };
  });
}

async function holdForAcceptedProposal({ ownerId, project, proposal }) {
  const amount = Math.round(Number(proposal.price));
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createHttpError.BadRequest("مبلغ پیشنهاد نامعتبر است");
  }

  if (project.escrowStatus === "held") {
    if (String(project.escrowProposal) === String(proposal._id)) {
      return { alreadyHeld: true, amount: project.escrowAmount };
    }
    throw createHttpError.BadRequest(
      "برای این پروژه مبلغی در حالت انتظار وجود دارد. ابتدا وضعیت پیشنهاد پذیرفته‌شده را تغییر دهید."
    );
  }

  return runWalletOp(async (session) => {
    await getOrCreateWallet(ownerId, session);

    const updated = await WalletModel.findOneAndUpdate(
      { user: ownerId, balance: { $gte: amount } },
      { $inc: { balance: -amount, heldBalance: amount } },
      { new: true, ...sessionOpts(session) }
    );
    if (!updated) throw insufficientFundsError();

    const claimed = await ProjectModel.findOneAndUpdate(
      {
        _id: project._id,
        escrowStatus: { $nin: ["held"] },
        status: { $ne: "COMPLETED" },
      },
      {
        $set: {
          escrowStatus: "held",
          escrowAmount: amount,
          escrowProposal: proposal._id,
        },
      },
      { new: true, ...sessionOpts(session) }
    );

    if (!claimed) {
      await WalletModel.updateOne(
        { _id: updated._id },
        { $inc: { balance: amount, heldBalance: -amount } },
        sessionOpts(session)
      );
      throw createHttpError.BadRequest(
        "امکان نگه‌داشت مبلغ برای این پروژه وجود ندارد"
      );
    }

    await createDocs(
      WalletTransactionModel,
      [
        {
          wallet: updated._id,
          type: TX_TYPES.HOLD,
          amount,
          relatedProject: project._id,
          relatedProposal: proposal._id,
          description: `نگه‌داشت مبلغ پیشنهاد برای پروژه «${project.title || ""}»`,
        },
      ],
      session
    );

    return { alreadyHeld: false, amount, wallet: updated };
  });
}

async function refundEscrowForProject({ ownerId, project, proposal }) {
  if (project.escrowStatus !== "held") return { skipped: true };

  const amount = Math.round(
    Number(project.escrowAmount) || Number(proposal?.price) || 0
  );
  if (!amount) return { skipped: true };

  return runWalletOp(async (session) => {
    const updated = await WalletModel.findOneAndUpdate(
      { user: ownerId, heldBalance: { $gte: amount } },
      { $inc: { heldBalance: -amount, balance: amount } },
      { new: true, ...sessionOpts(session) }
    );
    if (!updated) {
      throw createHttpError.BadRequest("بازگشت وجه انجام نشد");
    }

    await ProjectModel.updateOne(
      { _id: project._id, escrowStatus: "held" },
      {
        $set: {
          escrowStatus: "refunded",
          escrowAmount: 0,
          escrowProposal: null,
        },
      },
      sessionOpts(session)
    );

    await createDocs(
      WalletTransactionModel,
      [
        {
          wallet: updated._id,
          type: TX_TYPES.REFUND,
          amount,
          relatedProject: project._id,
          relatedProposal: proposal?._id || project.escrowProposal,
          description: `بازگشت مبلغ نگه‌داشته‌شده پروژه «${project.title || ""}»`,
        },
      ],
      session
    );

    return { skipped: false, amount, wallet: updated };
  });
}

async function releaseEscrowOnComplete({ ownerId, project }) {
  if (project.status === "COMPLETED") {
    throw createHttpError.BadRequest("این پروژه قبلاً تکمیل شده است");
  }
  if (project.escrowStatus !== "held") {
    throw createHttpError.BadRequest(
      "برای این پروژه مبلغی در حالت انتظار نیست. ابتدا یک پیشنهاد را بپذیرید."
    );
  }
  if (!project.freelancer) {
    throw createHttpError.BadRequest("فریلنسر این پروژه مشخص نیست");
  }

  const amount = Math.round(Number(project.escrowAmount));
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createHttpError.BadRequest("مبلغ نگه‌داشته‌شده نامعتبر است");
  }

  const freelancerId = project.freelancer._id || project.freelancer;

  return runWalletOp(async (session) => {
    const ownerWallet = await WalletModel.findOneAndUpdate(
      { user: ownerId, heldBalance: { $gte: amount } },
      { $inc: { heldBalance: -amount } },
      { new: true, ...sessionOpts(session) }
    );
    if (!ownerWallet) {
      throw createHttpError.BadRequest(
        "موجودی در انتظار برای آزادسازی کافی نیست"
      );
    }

    await getOrCreateWallet(freelancerId, session);
    const freelancerWallet = await WalletModel.findOneAndUpdate(
      { user: freelancerId },
      { $inc: { balance: amount } },
      { new: true, ...sessionOpts(session) }
    );

    const completed = await ProjectModel.findOneAndUpdate(
      { _id: project._id, escrowStatus: "held" },
      { $set: { escrowStatus: "released", status: "COMPLETED" } },
      { new: true, ...sessionOpts(session) }
    );

    if (!completed) {
      await WalletModel.updateOne(
        { _id: ownerWallet._id },
        { $inc: { heldBalance: amount } },
        sessionOpts(session)
      );
      await WalletModel.updateOne(
        { _id: freelancerWallet._id },
        { $inc: { balance: -amount } },
        sessionOpts(session)
      );
      throw createHttpError.BadRequest("تکمیل پروژه انجام نشد");
    }

    await createDocs(
      WalletTransactionModel,
      [
        {
          wallet: ownerWallet._id,
          type: TX_TYPES.RELEASE,
          amount,
          relatedProject: project._id,
          relatedProposal: project.escrowProposal,
          description: `آزادسازی مبلغ پس از تکمیل پروژه «${project.title || ""}»`,
        },
        {
          wallet: freelancerWallet._id,
          type: TX_TYPES.RELEASE,
          amount,
          relatedProject: project._id,
          relatedProposal: project.escrowProposal,
          description: `واریز مبلغ پروژه تکمیل‌شده «${project.title || ""}»`,
        },
      ],
      session
    );

    return { amount, ownerWallet, freelancerWallet };
  });
}

module.exports = {
  MIN_DEPOSIT_AMOUNT,
  MAX_DEPOSIT_AMOUNT,
  TX_TYPES,
  getOrCreateWallet,
  deposit,
  holdForAcceptedProposal,
  refundEscrowForProject,
  releaseEscrowOnComplete,
};
