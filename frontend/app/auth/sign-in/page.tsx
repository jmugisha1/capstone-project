"use client";
import { useSignIn } from "./script";

export default function SignInPage() {
  const { handleSubmit, error, loading } = useSignIn();

  return (
    <>
      <h1 className="text-size-02">welcome back</h1>

      <form className="auth-page-wrapper-forms" onSubmit={handleSubmit}>
        <input
          style={{ textTransform: "lowercase" }}
          className="auth-page-wrapper-forms-input text-size-03"
          type="email"
          name="email"
          placeholder="email"
          required
        />
        <input
          className="auth-page-wrapper-forms-input text-size-03"
          type="password"
          name="password"
          placeholder="password"
          required
        />
        {error && <p className="auth-error ">{error}</p>}
        <button
          type="submit"
          className="auth-page-wrapper-forms-submit"
          disabled={loading}
        >
          <span className="text-size-03">
            {loading ? "signing in..." : "sign in"}
          </span>
        </button>
      </form>
    </>
  );
}
