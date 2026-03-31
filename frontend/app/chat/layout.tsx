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
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("profile");
    if (cached) setFirstName(JSON.parse(cached).full_name.split(" ")[0]);

    api
      .get("/auth/profile/")
      .then((res) => {
        const name = res.data.full_name;
        setFirstName(name.split(" ")[0]);
        localStorage.setItem(
          "profile",
          JSON.stringify({ full_name: name, email: res.data.email }),
        );
      })
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  return (
    <div className="chat-wrapper">
      <ChatNavDesk
        firstName={firstName}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <ChatNavMobBar onOpen={() => setIsOpen(true)} />
      <ChatNavMob
        firstName={firstName}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <main className="chat-wrapper-main">{children}</main>
    </div>
  );
}
