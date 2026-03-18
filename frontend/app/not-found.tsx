import Link from "next/link";
import "./not-found.css";

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <nav className="not-found-page-nav">
        <div className="not-found-page-nav-logo">curamedic</div>

        <div className="not-found-page-nav-links">
          <Link
            className="not-found-page-nav-links-a text-size-04"
            href="/auth/sign-up"
          >
            create account
          </Link>
          <Link
            className="not-found-page-nav-links-a text-size-04"
            href="/auth/sign-in"
          >
            sign in
          </Link>
        </div>
      </nav>
      <main className="not-found-page-main">
        <span className="text-size-05">404 page</span>
        <h1 className="text-size-02">
          Symptoms: lost page.
          <br />
          Diagnosis: not found here. <br />
          Refer back to home.
        </h1>
      </main>
    </div>
  );
}
