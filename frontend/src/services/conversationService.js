import http from './httpService';

export function getConversationsAPI() {
  return http.get('/conversations').then(({ data }) => data.data);
}

export function getUnreadMessagesCountAPI() {
  return http.get('/conversations/unread-count').then(({ data }) => data.data);
}

export function getConversationByProposalAPI(proposalId) {
  return http
    .get(`/conversations/proposal/${proposalId}`)
    .then(({ data }) => data.data);
}

export function getConversationMessagesAPI(conversationId, limit = 50) {
  return http
    .get(`/conversations/${conversationId}/messages`, {
      params: { limit },
    })
    .then(({ data }) => data.data);
}

export function sendConversationMessageAPI({ conversationId, text }) {
  return http
    .post(`/conversations/${conversationId}/messages`, { text })
    .then(({ data }) => data.data);
}
