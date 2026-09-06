import http from './httpService';

export function uploadPortfolioFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  return http
    .post('/user/portfolio/upload', formData)
    .then(({ data }) => data.data);
}

export function deletePortfolioFile(fileId) {
  return http
    .delete(`/user/portfolio/${fileId}`)
    .then(({ data }) => data.data);
}

export function uploadProjectAttachment(projectId, file) {
  const formData = new FormData();
  formData.append('file', file);
  return http
    .post(`/project/${projectId}/attachment`, formData)
    .then(({ data }) => data.data);
}

export function uploadProjectDeliverable(projectId, file) {
  const formData = new FormData();
  formData.append('file', file);
  return http
    .post(`/project/${projectId}/deliverable`, formData)
    .then(({ data }) => data.data);
}
