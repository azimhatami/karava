import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

const http = {
  get: api.get,
  post: api.post,
  delete: api.delete,
  put: api.put,
  patch: api.patch,
};

export default http;
