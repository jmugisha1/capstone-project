import React from "react";
import { NavigationWebsite } from "../../components/navigation/navigation-component";
import "./auth-page.css";

type AuthMode = "signup" | "login" | "verify";

interface AuthPageProps {
  mode: AuthMode;
  title?: string;
  subtitle?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AuthPage({ mode, title, subtitle, onSubmit }: AuthPageProps) {
  const isSignup = mode === "signup";
  const isLogin = mode === "login";
  const isVerify = mode === "verify";

  const titleMap: Record<AuthMode, string> = {
    signup: "Create your account",
    login: "Welcome back",
    verify: "Verify your account",
  };

  const subtitleMap: Record<AuthMode, string> = {
    signup: "Join us and start your journey.",
    login: "Sign in to continue.",
    verify: "Enter the verification code sent to you.",
  };

  return (
    <div className="sign-up-wrapper">
      <NavigationWebsite />
      <main className="sign-up-wrapper-main">
        <div className="sign-up-wrapper-main-form">
          <h1 className="sign-up-wrapper-main-form-title">
            {title ?? titleMap[mode]}
          </h1>

          <p className="sign-up-wrapper-main-form-subtitle">
            {subtitle ?? subtitleMap[mode]}
          </p>

          <form className="sign-up-wrapper-form-sign-up" onSubmit={onSubmit}>
            {isSignup && (
              <>
                <input
                  type="text"
                  name="fullname"
                  placeholder="full name"
                  required
                />
                <input type="email" name="email" placeholder="email" required />
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  required
                />
                <input
                  type="password"
                  name="repeatPassword"
                  placeholder="repeat password"
                  required
                />
              </>
            )}

            {isLogin && (
              <>
                <input type="email" name="email" placeholder="email" required />
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  required
                />
              </>
            )}

            {isVerify && (
              <input
                type="text"
                name="verificationCode"
                placeholder="verification code"
                required
              />
            )}

            <button type="submit" className="sign-up-wrapper-form-sign-up-btn">
              {isSignup && "Sign Up"}
              {isLogin && "Login"}
              {isVerify && "Verify"}
            </button>
          </form>

          <p className="sign-up-wrapper-main-form-policy">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>

        <div className="sign-up-wrapper-main-img">
          <img src="/media/sign-up.jpg" alt="" />
        </div>
      </main>
    </div>
  );
}
