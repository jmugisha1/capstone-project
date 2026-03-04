"use client";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export const registerPatient = async (data: {
  full_name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register/", data);
  return response.data;
};

export function useSignUp() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeatPassword") as string;

    if (password !== repeatPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await registerPatient({
        full_name: formData.get("fullname") as string,
        email: formData.get("email") as string,
        password,
      });
      router.push(
        `/auth/verify-account?email=${encodeURIComponent(formData.get("email") as string)}`,
      );
    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return { handleSubmit };
}
