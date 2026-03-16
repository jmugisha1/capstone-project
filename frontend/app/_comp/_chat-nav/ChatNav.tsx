import Link from "next/link";
import "./ChatNav.styles.css";
import { useRef, useEffect } from "react";

type ChatNavDeskProps = {
  firstName: string;
  isCollapsed: boolean;
  onToggle: () => void;
};

type ChatNavMobProps = {
  firstName: string;
  isOpen: boolean;
  onClose: () => void;
};

type ChatNavMobBarProps = {
  onOpen: () => void;
};

/* ── Desktop sidebar ── */
export function ChatNavDesk({
  firstName,
  isCollapsed,
  onToggle,
}: ChatNavDeskProps) {
  return (
    <nav className={isCollapsed ? "chat-nav-collapsed" : "chat-nav"}>
      <main className="chat-nav-main">
        <button className="chat-nav-main-wrapper" onClick={onToggle}>
          {!isCollapsed && <span className="text-size-03">cura-medica</span>}
          <img src="/icons/panel-right.svg" alt="" className="icon-size-01" />
        </button>
        <Link href="/chat/new" className="chat-nav-main-wrapper">
          {!isCollapsed && <span className="text-size-03">new chat</span>}
          <img
            src="/icons/message-circle.svg"
            alt=""
            className="icon-size-01"
          />
        </Link>
        <Link href="/chat/reports" className="chat-nav-main-wrapper">
          {!isCollapsed && <span className="text-size-03">chat reports</span>}
          <img src="/icons/files.svg" alt="" className="icon-size-01" />
        </Link>
        <Link href="/chat/settings" className="chat-nav-main-wrapper">
          {!isCollapsed && <span className="text-size-03">app settings</span>}
          <img src="/icons/settings.svg" alt="" className="icon-size-01" />
        </Link>
      </main>
      <div className="chat-nav-account">
        {!isCollapsed && (
          <span className="text-size-03">{firstName || "..."}</span>
        )}
        <img src="/icons/user-round-pen.svg" alt="" className="icon-size-01" />
      </div>
    </nav>
  );
}

/* ── Mobile top bar (always visible on mobile) ── */
export function ChatNavMobBar({ onOpen }: ChatNavMobBarProps) {
  return (
    <div className="chat-nav-mob-bar">
      <span className="text-size-03">cura-medica</span>
      <button className="chat-nav-mob-bar-toggle" onClick={onOpen}>
        <img src="/icons/panel-right.svg" alt="" className="icon-size-01" />
      </button>
    </div>
  );
}

/* ── Mobile drawer ── */
export function ChatNavMob({ firstName, isOpen, onClose }: ChatNavMobProps) {
  return (
    <nav className={`chat-nav-mob ${isOpen ? "open" : ""}`}>
      <main className="chat-nav-mob-main">
        <button className="chat-nav-mob-main-wrapper" onClick={onClose}>
          <span className="text-size-03">cura-medica</span>
          <img src="/icons/panel-right.svg" alt="" className="icon-size-01" />
        </button>
        <Link
          href="/chat/new"
          className="chat-nav-mob-main-wrapper"
          onClick={onClose}
        >
          <span className="text-size-03">new chat</span>
          <img
            src="/icons/message-circle.svg"
            alt=""
            className="icon-size-01"
          />
        </Link>
        <Link
          href="/chat/reports"
          className="chat-nav-mob-main-wrapper"
          onClick={onClose}
        >
          <span className="text-size-03">chat reports</span>
          <img src="/icons/files.svg" alt="" className="icon-size-01" />
        </Link>
        <Link
          href="/chat/settings"
          className="chat-nav-mob-main-wrapper"
          onClick={onClose}
        >
          <span className="text-size-03">app settings</span>
          <img src="/icons/settings.svg" alt="" className="icon-size-01" />
        </Link>
      </main>
      <div className="chat-nav-mob-account">
        <span className="text-size-03">{firstName || "..."}</span>
        <img src="/icons/user-round-pen.svg" alt="" className="icon-size-01" />
      </div>
    </nav>
  );
}
