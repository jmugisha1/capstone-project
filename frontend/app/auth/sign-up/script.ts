"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../_config/api";

const registerPatient = async (data: {
  full_name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register/patient/", data);
  return response.data;
};

export function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 12) errors.push("at least 12 characters");
  if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
  if (!/\d/.test(password)) errors.push("one number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    errors.push("one special character (!@#$%^&*)");
  return errors;
}

export function useSignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPasswordErrors([]);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeatPassword") as string;

    if (password !== repeatPassword) {
      setError("passwords do not match.");
      setLoading(false);
      return;
    }

    const pwErrors = validatePassword(password);
    if (pwErrors.length > 0) {
      setPasswordErrors(pwErrors);
      setLoading(false);
      return;
    }

    try {
      await registerPatient({
        full_name: formData.get("fullname") as string,
        email: formData.get("email") as string,
        password,
      });
      router.push("/auth/sign-in");
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.password) {
        setPasswordErrors(
          Array.isArray(data.password) ? data.password : [data.password],
        );
      } else if (data?.email) {
        setError(Array.isArray(data.email) ? data.email[0] : data.email);
      } else {
        setError(
          data?.message ||
            data?.detail ||
            "something went wrong. please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, error, passwordErrors, loading };
}
