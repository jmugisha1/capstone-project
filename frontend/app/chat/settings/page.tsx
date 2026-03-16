"use client";
import { useSettings } from "./script";
import "./styles.css";

export default function ChatSettings() {
  const { profile, handleLogout } = useSettings();

  return (
    <div className="chat-main-inner chat-main-outer">
      <h1 className="text-size-02">app settings</h1>

      <main className="chat-settings-main">
        <div className="chat-settings-main-wrapper">
          <div className="chat-settings-main-wrapper-title">
            <img
              src="/icons/user-round-pen.svg"
              alt=""
              className="icon-size-01"
            />
            <span className="text-size-03">full names</span>
          </div>
          <span className="text-size-03" style={{ textTransform: "lowercase" }}>
            {profile.full_name || "..."}
          </span>
        </div>

        <div className="chat-settings-main-wrapper">
          <div className="chat-settings-main-wrapper-title">
            <img src="/icons/mail.svg" alt="" className="icon-size-01" />
            <span className="text-size-03">email address</span>
          </div>
          <span className="text-size-03" style={{ textTransform: "lowercase" }}>
            {profile.email || "..."}
          </span>
        </div>

        <button className="chat-settings-main-cta" onClick={handleLogout}>
          <img src="/icons/log-out.svg" alt="" className="icon-size-01" />
          <span className="text-size-03">sign out</span>
        </button>
      </main>
    </div>
  );
}
