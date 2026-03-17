"use client";
import { useSignIn } from "./script";

export default function SignInPage() {
  const { handleSubmit } = useSignIn();

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
        <button type="submit" className="auth-page-wrapper-forms-submit">
          <span className="text-size-03">sign in</span>
        </button>
      </form>
    </>
  );
}
