const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { WalletTransactionModel } = require("../../models/walletTransaction");
const { depositSchema } = require("../validators/wallet.schema");
const {
  getOrCreateWallet,
  deposit,
} = require("../../../utils/walletHelpers");

class WalletController extends Controller {
  async getWallet(req, res) {
    const userId = req.user._id;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const wallet = await getOrCreateWallet(userId);
    const [transactions, total] = await Promise.all([
      WalletTransactionModel.find({ wallet: wallet._id })
        .populate([
          { path: "relatedProject", select: { title: 1 } },
          { path: "relatedProposal", select: { price: 1, status: 1 } },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WalletTransactionModel.countDocuments({ wallet: wallet._id }),
    ]);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        isMock: true,
        wallet: {
          balance: wallet.balance,
          heldBalance: wallet.heldBalance,
        },
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      },
    });
  }

  async deposit(req, res) {
    const { amount } = await depositSchema.validateAsync(req.body);
    const { wallet, transaction } = await deposit({
      userId: req.user._id,
      amount,
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        isMock: true,
        message: "شارژ آزمایشی با موفقیت انجام شد",
        wallet: {
          balance: wallet.balance,
          heldBalance: wallet.heldBalance,
        },
        transaction,
      },
    });
  }
}

module.exports = {
  WalletController: new WalletController(),
};
