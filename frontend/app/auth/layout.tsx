"use client";
import Link from "next/link";
import "./layout.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-page">
      <header className="auth-page-header">
        <Link className="text-size-03 auth-page-header-link" href="/">
          cura medica
        </Link>
      </header>
      <section className="auth-page-wrapper">{children}</section>
      <footer className="auth-page-footer">
        <p className="text-size-05" style={{ textAlign: "center" }}>
          by continuing, you acknowledge that you understand <br />
          and agree to the terms & conditions and privacy policy
        </p>
      </footer>
    </div>
  );
}
