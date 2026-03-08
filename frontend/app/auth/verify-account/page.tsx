import { Suspense } from "react";
import VerifyAccountContent from "./verify-account-content";

export default function VerifyAccountPage() {
  return (
    <Suspense>
      <VerifyAccountContent />
    </Suspense>
  );
}
