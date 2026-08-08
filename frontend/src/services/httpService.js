import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// After one failed refresh, treat the session as logged-out and stop retrying.
let refreshPromise = null;
let refreshFailed = false;

export function resetAuthRefreshState() {
  refreshFailed = false;
  refreshPromise = null;
}

function isRefreshTokenRequest(config) {
  const url = config?.url || '';
  return url.includes('/user/refresh-token');
}

async function refreshAccessToken() {
  if (refreshFailed) {
    throw new Error('No valid session');
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .get(`${BASE_URL}/user/refresh-token`, { withCredentials: true })
      .then((res) => {
        refreshFailed = false;
        return res.data;
      })
      .catch((error) => {
        refreshFailed = true;
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    const status = err.response?.status;

    if (status !== 401 || !originalConfig) {
      return Promise.reject(err);
    }

    // Guests / expired sessions: do not refresh the refresh endpoint itself.
    if (isRefreshTokenRequest(originalConfig)) {
      refreshFailed = true;
      return Promise.reject(err);
    }

    // Already retried this request, or we already know refresh will fail.
    if (originalConfig._retry || refreshFailed) {
      return Promise.reject(err);
    }

    originalConfig._retry = true;

    try {
      await refreshAccessToken();
      return api(originalConfig);
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

const http = {
  get: api.get,
  post: api.post,
  delete: api.delete,
  put: api.put,
  patch: api.patch,
};

export default http;
