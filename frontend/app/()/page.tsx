import "./page.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="home-wrapper">
      <aside className="home-wrapper-aside"></aside>
      <main className="home-wrapper-main">
        <h1 className="text-size-02">
          welcome to your everyday
          <br />
          AI medical consultant
        </h1>
        <span className="text-size-05">
          cura mediaca aims to help its user's climate unnecessary medical
          generalists by diagnosis diseases and recommending the right
          specialist
        </span>
        <div className="home-wrapper-auth-links">
          <Link
            href="/auth/sign-up"
            className="home-wrapper-auth-links-a text-size-03"
          >
            create account
          </Link>
          <Link
            href="/auth/sign-in"
            className="home-wrapper-auth-links-a text-size-0"
          >
            log-in account
          </Link>
        </div>
      </main>
    </div>
  );
}
