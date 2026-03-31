"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../_config/api";

const loginPatient = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login/", data);
  return response.data;
};

export function useSignIn() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
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
      const status = error.response?.status;
      if (status === 401 || status === 400 || status === 404) {
        setError("incorrect email or password. please try again.");
      } else {
        setError("something went wrong. please try again later.");
      }
      console.log("error state set");
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, error, loading };
}
