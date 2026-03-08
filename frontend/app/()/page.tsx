import "./page.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="home-wrapper">
      <main className="home-wrapper-main">
        <img
          src="/icons/ssVector.svg"
          alt=""
          className="home-wrapper-main-icon"
        />
        <h1 className="home-wrapper-main-title">
          Transforming healthcare through
          <br /> ai medical consultation
        </h1>
        <p className="home-wrapper-main-title-sub">
          From symptoms to insights—our intelligent chatbot gathers patient
          information and uses machine learning to classify potential diseases
          quickly, helping healthcare teams act faster with safer, data-driven
          decisions.
        </p>
      </main>
      <div className="home-wrapper-auth">
        <h3 className="home-wrapper-auth-title">get started</h3>
        <div className="home-wrapper-auth-links">
          <Link href="/auth/sign-up" className="home-wrapper-auth-links-signup">
            create account
          </Link>
          <Link href="/auth/sign-in" className="home-wrapper-auth-links-login">
            log-in account
          </Link>
        </div>
      </div>
    </div>
  );
}
