// services/auth.service.ts
//You can. But if you have 5 pages that need auth calls (login, verify, reset password, delete account)
// you'd repeat the same logic in each. One change to the endpoint = 5 files to update.
import api from "../../lib/api";

export const registerPatient = async (data: {
  full_name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register/patient/", data);
  return response.data;
};

export const loginPatient = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/login/", data);
  return response.data;
};

export const verifyEmail = async (data: { email: string; code: string }) => {
  const response = await api.post("/auth/verify-email/", data);
  return response.data;
};
