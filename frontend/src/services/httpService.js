import axios from 'axios';


const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (res) => res,
  (err) => Promise.reject(err)
)

api.interceptors.response.use(
  res => res,
  async (err) => {
    const originalConfig = err.config;
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const { data } = await axios.get(`${BASE_URL}/user/refresh-token`, {
          withCredentials: true
        });
        if (data) return api(originalConfig)

      } catch(error) {
        return Promise.reject(error)
      }
    }
    return Promise.reject(err)
  }
)

const http = {
  get: api.get,
  post: api.post,
  delete: api.delete,
  put: api.put,
  patch: api.patch,
};

export default http;
