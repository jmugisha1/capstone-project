"use client";
import { useSignIn } from "./script";
import { AuthPage } from "../_components/auth-page";

export default function SignInPage() {
  const { handleSubmit } = useSignIn();
  return <AuthPage mode="login" onSubmit={handleSubmit} />;
}
