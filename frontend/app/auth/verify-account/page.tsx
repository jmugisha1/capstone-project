export const dynamic = "force-dynamic";
import { Suspense } from "react";
import VerifyAccountContent from "./verify-account-content";

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyAccountContent />
    </Suspense>
  );
}
