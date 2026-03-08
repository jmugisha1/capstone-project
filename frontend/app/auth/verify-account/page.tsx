"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { AuthPage } from "../_components/auth-page";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "../_config/auth-config";

function VerifyAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await verifyEmail({
        email,
        code: formData.get("verificationCode") as string,
      });
      router.push("/auth/login");
    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Verification failed");
    }
  };

  return <AuthPage mode="verify" onSubmit={handleSubmit} />;
}

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyAccountContent />
    </Suspense>
  );
}
