"use client";
import { useSignUp } from "./script";

export default function SignUpPage() {
  const { handleSubmit, error, passwordErrors, loading } = useSignUp();

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
        {/*  */}
        {passwordErrors.length === 0 && (
          <p className="text-size-05">
            min 12 chars, uppercase, lowercase, number & special character
          </p>
        )}
        {error && <p className="auth-error">{error}</p>}
        {passwordErrors.length > 0 && (
          <p className="auth-error">
            password needs: {passwordErrors.join(", ")}
          </p>
        )}
        {/*  */}
        <button
          type="submit"
          className="auth-page-wrapper-forms-submit"
          disabled={loading}
        >
          <span className="text-size-03">
            {loading ? "creating..." : "create account"}
          </span>
        </button>
      </form>
    </>
  );
}
