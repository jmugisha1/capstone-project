"use client";
import { useSignUp } from "./script";

export default function SignUpPage() {
  const { handleSubmit } = useSignUp();

  return (
    <>
      <h1 className="text-size-02">create account</h1>
      <form className="auth-page-wrapper-forms" onSubmit={handleSubmit}>
        <input
          style={{ textTransform: "lowercase" }}
          className="auth-page-wrapper-forms-input text-size-03"
          type="text"
          name="fullname"
          placeholder="full names"
          required
        />
        <input
          style={{ textTransform: "lowercase" }}
          className="auth-page-wrapper-forms-input text-size-03"
          type="email"
          name="email"
          placeholder="email address"
          required
        />
        <input
          className="auth-page-wrapper-forms-input text-size-03"
          type="password"
          name="password"
          placeholder="password"
          required
        />
        <input
          className="auth-page-wrapper-forms-input text-size-03"
          type="password"
          name="repeatPassword"
          placeholder="repeat password"
          required
        />
        <button type="submit" className="auth-page-wrapper-forms-submit">
          <span className="text-size-03">create account</span>
        </button>
      </form>
    </>
  );
}
