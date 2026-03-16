"use client";
import { useRouter } from "next/navigation";
import api from "../../_config/api";

const logoutPatient = async () => {
  const refresh = localStorage.getItem("refresh");
  const response = await api.post("/auth/logout/", { refresh });
  return response.data;
};

export function useSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logoutPatient();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      router.push("/auth/sign-in");
    }
  };

  return { handleSignOut };
}
