"use client";
import { useSignUp } from "./script";
import { AuthPage } from "../_components/auth-page";

export default function SignUpPage() {
  const { handleSubmit } = useSignUp();
  return (
    <AuthPage
      mode="signup"
      title="welcome to curamedica your dedicated ai medical consultant"
      onSubmit={handleSubmit}
    />
  );
}
