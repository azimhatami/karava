import http from './httpService';

export function createReviewAPI({ projectId, rating, comment }) {
  return http
    .post('/review', { projectId, rating, comment })
    .then(({ data }) => data.data);
}

export function getReviewsForUserAPI(userId, { page = 1, limit = 20 } = {}) {
  return http
    .get(`/review/user/${userId}`, { params: { page, limit } })
    .then(({ data }) => data.data);
}

export function getReviewsForProjectAPI(projectId) {
  return http
    .get(`/review/project/${projectId}`)
    .then(({ data }) => data.data);
}
