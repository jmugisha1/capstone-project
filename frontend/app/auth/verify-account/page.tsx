import dynamic from "next/dynamic";

const VerifyAccountContent = dynamic(() => import("./verify-account-content"), {
  ssr: false,
});

export default function VerifyAccountPage() {
  return <VerifyAccountContent />;
}
