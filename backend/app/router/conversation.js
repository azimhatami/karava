const expressAsyncHandler = require("express-async-handler");
const {
  ConversationController,
} = require("../http/controllers/conversation.controller");

const router = require("express").Router();

router.get(
  "/",
  expressAsyncHandler(ConversationController.listConversations)
);
router.get(
  "/unread-count",
  expressAsyncHandler(ConversationController.getUnreadCount)
);
router.get(
  "/proposal/:proposalId",
  expressAsyncHandler(ConversationController.getByProposal)
);
router.get(
  "/:conversationId/messages",
  expressAsyncHandler(ConversationController.getMessages)
);
router.post(
  "/:conversationId/messages",
  expressAsyncHandler(ConversationController.sendMessage)
);

module.exports = {
  conversationRoutes: router,
};
