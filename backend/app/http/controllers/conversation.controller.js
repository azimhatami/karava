const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const { ConversationModel } = require("../../models/conversation");
const { MessageModel } = require("../../models/message");
const {
  sendMessageSchema,
  conversationIdParamSchema,
} = require("../validators/conversation.schema");
const { ROLES } = require("../../../utils/constants");

class ConversationController extends Controller {
  assertMember(conversation, userId) {
    const uid = String(userId);
    const ownerId = conversation.owner?._id || conversation.owner;
    const freelancerId = conversation.freelancer?._id || conversation.freelancer;
    if (String(ownerId) !== uid && String(freelancerId) !== uid) {
      throw createHttpError.Forbidden("شما به این گفتگو دسترسی ندارید");
    }
  }

  async listConversations(req, res) {
    const userId = req.user._id;
    const conversations = await ConversationModel.find({
      $or: [{ owner: userId }, { freelancer: userId }],
    })
      .populate([
        { path: "project", select: { title: 1 } },
        { path: "owner", select: { name: 1 } },
        { path: "freelancer", select: { name: 1 } },
        { path: "proposal", select: { status: 1, price: 1 } },
      ])
      .sort({ updatedAt: -1 })
      .lean();

    const enriched = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await MessageModel.findOne({
          conversation: conversation._id,
        })
          .sort({ createdAt: -1 })
          .select({ text: 1, createdAt: 1, sender: 1, isRead: 1 })
          .lean();

        const unreadCount = await MessageModel.countDocuments({
          conversation: conversation._id,
          sender: { $ne: userId },
          isRead: false,
        });

        const isOwner = String(conversation.owner._id || conversation.owner) ===
          String(userId);
        const counterpart = isOwner
          ? conversation.freelancer
          : conversation.owner;

        return {
          _id: conversation._id,
          project: conversation.project,
          proposal: conversation.proposal,
          counterpart: {
            _id: counterpart?._id,
            name: counterpart?.name || "کاربر",
          },
          lastMessage: lastMessage
            ? {
                text: lastMessage.text,
                createdAt: lastMessage.createdAt,
                sender: lastMessage.sender,
              }
            : null,
          unreadCount,
          updatedAt: conversation.updatedAt,
          createdAt: conversation.createdAt,
        };
      })
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        conversations: enriched,
      },
    });
  }

  async getUnreadCount(req, res) {
    const userId = req.user._id;
    const conversationIds = await ConversationModel.find({
      $or: [{ owner: userId }, { freelancer: userId }],
    }).distinct("_id");

    const unreadCount = await MessageModel.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: userId },
      isRead: false,
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { unreadCount },
    });
  }

  async getByProposal(req, res) {
    const { proposalId } = req.params;
    if (!mongoose.isValidObjectId(proposalId)) {
      throw createHttpError.BadRequest("شناسه پیشنهاد نامعتبر است");
    }

    const conversation = await ConversationModel.findOne({
      proposal: proposalId,
    }).lean();

    if (!conversation) {
      throw createHttpError.NotFound("گفتگویی برای این پیشنهاد یافت نشد");
    }

    this.assertMember(conversation, req.user._id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { conversation },
    });
  }

  async getMessages(req, res) {
    const { conversationId } = await conversationIdParamSchema.validateAsync(
      req.params
    );
    const limit = Math.min(Number(req.query.limit) || 50, 100);

    const conversation = await ConversationModel.findById(conversationId)
      .populate([
        { path: "project", select: { title: 1 } },
        { path: "owner", select: { name: 1 } },
        { path: "freelancer", select: { name: 1 } },
      ])
      .lean();

    if (!conversation) throw createHttpError.NotFound("مکالمه یافت نشد");
    this.assertMember(conversation, req.user._id);

    await MessageModel.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.user._id },
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    const messages = await MessageModel.find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({ path: "sender", select: { name: 1 } })
      .lean();

    messages.reverse();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        conversation,
        messages,
      },
    });
  }

  async sendMessage(req, res) {
    const { conversationId } = await conversationIdParamSchema.validateAsync(
      req.params
    );
    const { text } = await sendMessageSchema.validateAsync(req.body);

    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) throw createHttpError.NotFound("مکالمه یافت نشد");
    this.assertMember(conversation, req.user._id);

    const message = await MessageModel.create({
      conversation: conversationId,
      sender: req.user._id,
      text,
      isRead: false,
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    const populated = await MessageModel.findById(message._id)
      .populate({ path: "sender", select: { name: 1 } })
      .lean();

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: populated,
      },
    });
  }
}

module.exports = {
  ConversationController: new ConversationController(),
};
