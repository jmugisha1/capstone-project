"use client";
import { useEffect, useState } from "react";
import api from "../_config/api";
import {
  ChatNavDesk,
  ChatNavMob,
  ChatNavMobBar,
} from "../_comp/_chat-nav/ChatNav";
import "./layout.css";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firstName, setFirstName] = useState("");
  const [theme, setTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className="chat-wrapper">
      {/* Desktop sidebar */}
      <ChatNavDesk
        firstName={firstName}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Mobile top bar — "cura-medica" + sidebar icon */}
      <ChatNavMobBar onOpen={() => setIsOpen(true)} />

      {/* Mobile slide-out drawer */}
      <ChatNavMob
        firstName={firstName}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <section className="chat-content">{children}</section>
    </div>
  );
}
