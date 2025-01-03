import http from './httpService';


export function changeProposalStatusAPI({ proposalId, ...data }) {
  return http.patch(`/proposal/${proposalId}`, data).then(({ data }) => data.data);
}

export function getProposalsAPI() {
  return http.get('/proposal/list').then(({ data }) => data.data);
}

export function createProposalAPI(data) {
  return http.post('/proposal/add', data).then(({ data }) => data.data);
}
