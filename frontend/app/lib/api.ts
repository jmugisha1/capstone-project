import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://capstone-project-f5nm.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401, redirect if refresh fails
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
            refresh,
          });
          localStorage.setItem("access", res.data.access);
          if (res.data.refresh) {
            localStorage.setItem("refresh", res.data.refresh);
          }
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch {
          // Refresh failed — redirect to login
        }
      }

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/auth/sign-in";
    }

    return Promise.reject(error);
  },
);

export default api;

export const getProfile = async () => {
  const response = await api.get("/auth/profile/");
  return response.data;
};
