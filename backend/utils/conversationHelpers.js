const { ConversationModel } = require("../app/models/conversation");

/**
 * Ensure a conversation exists for an accepted proposal.
 * Idempotent: returns existing conversation if already created.
 */
async function ensureConversationForAcceptedProposal({
  proposal,
  project,
}) {
  if (!proposal?._id || !project?._id) return null;

  const existing = await ConversationModel.findOne({ proposal: proposal._id });
  if (existing) return existing;

  return ConversationModel.create({
    project: project._id,
    proposal: proposal._id,
    owner: project.owner,
    freelancer: proposal.user,
  });
}

module.exports = {
  ensureConversationForAcceptedProposal,
};
