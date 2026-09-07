const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const { ProposalModel } = require("../../models/proposal");
const { addProposalSchema } = require("../validators/proposal.schema");
const { ProjectModel } = require("../../models/project");
const { copyObject } = require("../../../utils/functions");
const { ROLES } = require("../../../utils/constants");
const {
  ACTION_TYPES,
  assertProfileCompleteForAction,
} = require("../../../utils/profileCompleteness");
const {
  ensureConversationForAcceptedProposal,
} = require("../../../utils/conversationHelpers");
const {
  holdForAcceptedProposal,
  refundEscrowForProject,
} = require("../../../utils/walletHelpers");

class ProposalController extends Controller {
  async addNewProposal(req, res) {
    const userId = req.user._id;
    const { description, price, duration, durationUnit = "day", projectId } =
      await addProposalSchema.validateAsync(req.body);

    assertProfileCompleteForAction(
      req.user,
      ACTION_TYPES.SEND_PROPOSAL,
      "برای ارسال پیشنهاد باید ابتدا پروفایل خود را تکمیل کنید"
    );

    const proposal = await ProposalModel.create({
      description,
      price,
      duration,
      durationUnit,
      user: userId,
    });
    await ProjectModel.updateOne(
      { _id: projectId },
      { $push: { proposals: proposal._id } }
    );
    if (!proposal?._id)
      throw createHttpError.InternalServerError("پیشنهاد ثبت نشد");

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "پیشنهاد با موفقیت ایجاد شد",
      },
    });
  }
  async getListOfProposals(req, res) {
    let dbQuery = {};
    const { sort } = req.query;

    const user = req.user;
    if (user.role !== ROLES.ADMIN) {
      dbQuery["user"] = user._id;
    }

    const sortQuery = {};

    if (!sort) sortQuery["createdAt"] = 1;
    if (sort) {
      if (sort === "latest") sortQuery["createdAt"] = -1;
      if (sort === "earliest") sortQuery["createdAt"] = 1;
    }

    const proposals = await ProposalModel.find(dbQuery).sort(sortQuery);

    const { ConversationModel } = require("../../models/conversation");
    const proposalIds = proposals
      .filter((p) => Number(p.status) === 2)
      .map((p) => p._id);

    const conversations = proposalIds.length
      ? await ConversationModel.find({ proposal: { $in: proposalIds } })
          .select({ proposal: 1 })
          .lean()
      : [];

    const conversationByProposal = new Map(
      conversations.map((c) => [String(c.proposal), String(c._id)])
    );

    const enriched = proposals.map((proposal) => {
      const obj = proposal.toObject();
      obj.conversationId =
        conversationByProposal.get(String(proposal._id)) || null;
      return obj;
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        proposals: enriched,
      },
    });
  }
  async getProposalById(req, res) {
    const { id } = req.params;
    const proposal = await this.findProposalById(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        proposal,
      },
    });
  }
  async findProposalById(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest("شناسه پروژه ارسال شده صحیح نمیباشد");
    const proposal = await ProposalModel.findById(id);
    if (!proposal) throw createHttpError.NotFound("پروژه یافت نشد.");
    return proposal;
  }
  async changeProposalStatus(req, res) {
    const { id } = req.params;
    let { status } = req.body;
    status = Number(status);
    if (![0, 1, 2].includes(status)) {
      throw createHttpError.BadRequest("وضعیت ارسال شده صحیح نمیباشد");
    }

    const proposal = await ProposalModel.findById(id);
    if (!proposal) throw createHttpError.NotFound("پیشنهاد یافت نشد");

    const project = await ProjectModel.findOne({
      proposals: { $in: [proposal._id] },
    });
    if (!project) throw createHttpError.NotFound("پروژه مرتبط یافت نشد");

    const isAdmin = req.user.role === ROLES.ADMIN;
    if (!isAdmin && String(project.owner) !== String(req.user._id)) {
      throw createHttpError.Forbidden(
        "شما اجازه تغییر وضعیت این پیشنهاد را ندارید"
      );
    }

    if (project.status === "COMPLETED") {
      throw createHttpError.BadRequest(
        "این پروژه تکمیل شده و وضعیت پیشنهاد قابل تغییر نیست"
      );
    }

    const previousStatus = Number(proposal.status);
    const ownerId = project.owner;

    if (status === 2 && previousStatus !== 2) {
      await holdForAcceptedProposal({
        ownerId,
        project,
        proposal,
      });
    }

    if (previousStatus === 2 && status !== 2) {
      await refundEscrowForProject({
        ownerId,
        project,
        proposal,
      });
    }

    proposal.status = status;
    await proposal.save();

    let freelancer = copyObject(proposal).user;
    if (status !== 2) freelancer = null;

    await ProjectModel.updateOne({ _id: project._id }, { $set: { freelancer } });

    let conversation = null;
    if (status === 2) {
      try {
        conversation = await ensureConversationForAcceptedProposal({
          proposal,
          project,
        });
      } catch (err) {
        console.error(
          "Failed to create conversation for accepted proposal:",
          err?.message || err
        );
      }
    }

    let message = "وضعیت پروپوزال تایید شد";
    if (status === 0) message = "وضعیت پروپوزال به حالت رد شده تغییر یافت";
    if (status === 1)
      message = "وضعیت پروپوزال به حالت در انتظار تایید تغییر یافت";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
        conversationId: conversation?._id || null,
      },
    });
  }
}

module.exports = {
  ProposalController: new ProposalController(),
};
