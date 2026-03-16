"use client";
import "./layout.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-page">
      <header className="auth-page-header">cura medica</header>
      <section className="auth-page-wrapper">{children}</section>
      <footer className="auth-page-footer">
        <p>Terms of Use | Privacy Policy</p>
      </footer>
    </div>
  );
}
