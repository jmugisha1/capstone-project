"use client";
import { useRouter } from "next/navigation";
import api from "../../_config/api";

const loginPatient = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login/", data);
  return response.data;
};

export function useSignIn() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const res = await loginPatient({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      localStorage.setItem("access", res.access);
      localStorage.setItem("refresh", res.refresh);
      router.push("/chat/new");
    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  return { handleSubmit };
}
