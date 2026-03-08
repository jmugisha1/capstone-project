"use client";
import Link from "next/link";
import { useSettings } from "./script";
import "./styles.css";

export default function ChatSettings() {
  const { isDark, profile, toggleTheme, handleLogout } = useSettings();

  return (
    <div className="chat-settings">
      <header className="chat-settings-header">
        <img
          src="/icons/sliders-horizontal.svg"
          alt=""
          className="chat-settings-header-icon"
        />
        <h1 className="chat-settings-header-title">app settings</h1>
      </header>

      <div className="chat-settings-subheader">
        <p className="chat-settings-subheader-par">
          all the chats with the curamedica will appear here
        </p>
        <button className="chat-settings-subheader-cta" onClick={handleLogout}>
          <img src="/icons/sign-out.svg" alt="" />
          <span>sign out</span>
        </button>
      </div>

      <div className="chat-settings-theme">
        <p className="chat-settings-ttitle">general settings</p>
        <div className="chat-settings-theme-wrapper">
          <p className="chat-settings-theme-wrapper-title">
            <span>theme</span>
            <img src={"/icons/toggle-right.svg"} alt="" />
          </p>

          <div className="chat-settings-theme-wrapper-choose">
            <div
              className={`chat-settings-theme-wrapper-choose-dark ${isDark ? "theme-active" : ""}`}
              onClick={toggleTheme}
            >
              <span>dark mode</span>
              <img src="/icons/moon.svg" alt="" />
            </div>
            <div
              className={`chat-settings-theme-wrapper-choose-light ${!isDark ? "theme-active" : ""}`}
              onClick={toggleTheme}
            >
              <img src="/icons/sun.svg" alt="" />
              <span>light mode</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-settings-account">
        <p className="chat-settings-account-title">account settings</p>
        <div className="chat-settings-account-wrapper">
          <div className="chat-settings-account-row">
            <p className="chat-settings-account-row-desc">
              <img src="/icons/user.svg" alt="" />
              <span>full names</span>
            </p>
            <h4 className="chat-settings-account-row-label">
              {profile.full_name || "..."}
            </h4>
          </div>
          <div className="chat-settings-account-row">
            <p className="chat-settings-account-row-desc">
              <img src="/icons/envelope-simple-open.svg" alt="" />
              <span>email address</span>
            </p>
            <h4 className="chat-settings-account-row-label">
              {profile.email || "..."}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
