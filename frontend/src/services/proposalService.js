import http from './httpService';


export function changeProposalStatusAPI({ id, data }) {
  return http.patch(`/proposal/${id}`, data).then(({ data }) => data.data);
}

export function getProposalsAPI() {
  return http.get('/proposal/list').then(({ data }) => data.data);
}
