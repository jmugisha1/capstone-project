"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import "./layout.css";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firstName, setFirstName] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);

    const handleThemeChange = () => {
      const updated = localStorage.getItem("theme");
      if (updated) setTheme(updated);
    };

    window.addEventListener("theme-change", handleThemeChange);

    api
      .get("/auth/profile/")
      .then((res) => setFirstName(res.data.full_name.split(" ")[0]))
      .catch((err) => console.error("Failed to fetch profile", err));

    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  return (
    <div className="chat-wrapper" data-theme={theme}>
      <nav className="chat-wrapper-navigation">
        <main className="chat-wrapper-navigation-main">
          <button className="chat-wrapper-navigation-main-cta">
            <h1>cura-medica</h1>
            <img
              className="navigation-main-cta-icon"
              src="/icons/sidebar-simple.svg"
              alt=""
            />
          </button>
          <Link href="/chat/new" className="chat-wrapper-navigation-main-link">
            <span className="navigation-main-links-span">new chat</span>
            <img
              className="navigation-main-links-icons"
              src="/icons/chats-circle.svg"
              alt=""
            />
          </Link>
          <Link
            href="/chat/history"
            className="chat-wrapper-navigation-main-link"
          >
            <span className="navigation-main-links-span">chat history</span>
            <img
              className="navigation-main-links-icons"
              src="/icons/clock-counter-clockwise.svg"
              alt=""
            />
          </Link>
          <Link
            href="/chat/settings"
            className="chat-wrapper-navigation-main-link"
          >
            <span className="navigation-main-links-span">app settings</span>
            <img
              className="navigation-main-links-icons"
              src="/icons/sliders-horizontal.svg"
              alt=""
            />
          </Link>
        </main>
        <div className="navigation-account">
          <h1>{firstName || "..."}</h1>
        </div>
      </nav>

      <section className="chat-content">{children}</section>
    </div>
  );
}
