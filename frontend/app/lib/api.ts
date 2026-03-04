// lib/api.ts
//Creates a pre-configured axios instance so you don't repeat http://localhost:8000/api in every request.
// Instead of:
// tsaxios.get("http://localhost:8000/api/auth/login/")
// You just write:
// tsapi.get("/auth/login/")

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const getProfile = async () => {
  const response = await api.get("/auth/profile/");
  return response.data;
};
