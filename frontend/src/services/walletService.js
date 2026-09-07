import http from './httpService';

export function getWalletAPI({ page = 1, limit = 10 } = {}) {
  return http
    .get('/wallet', { params: { page, limit } })
    .then(({ data }) => data.data);
}

export function depositWalletAPI(amount) {
  return http.post('/wallet/deposit', { amount }).then(({ data }) => data.data);
}
