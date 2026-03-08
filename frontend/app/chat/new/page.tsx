"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useChatSession } from "./script";
import "./page.css";

type Agent = { imgSrc: string; desc: string; href: string };

const agents: Agent[] = [
  {
    imgSrc: "/media/Frame-18.png",
    desc: "new agent for booking comming soon.",
    href: "#",
  },
  {
    imgSrc: "/media/Frame-20.png",
    desc: "new agent for voice chatting comming soon.",
    href: "#",
  },
  {
    imgSrc: "/media/Frame-19.png",
    desc: "new agent for transalating comming soon",
    href: "#",
  },
];

export default function NewChat() {
  const { messages, stage, handleSend, formatHeaderName, formatHeaderDate } =
    useChatSession();
  const [text, setText] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const placeholder =
    stage === "start"
      ? "Describe your symptoms..."
      : stage === "questions"
        ? "Type Yes or No..."
        : "Type anything to start over...";

  const handleSubmit = () => {
    if (!text.trim()) return;
    handleSend(text.trim());
    setText("");
  };

  return (
    <div className="chat-new">
      <header className="chat-new-header">
        <p className="chat-new-header-par">{formatHeaderName()}</p>
        <p className="chat-new-header-par">{formatHeaderDate()}</p>
      </header>

      <main
        className={`chat-new-main ${hasMessages ? "chat-new-main--active" : ""}`}
      >
        {!hasMessages ? (
          <h1>Hello, how are you feeling today?</h1>
        ) : (
          <div className="chat-new-messages" ref={messagesRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`message message--${msg.role}`}>
                <div
                  className={`message-bubble ${msg.role === "assistant" ? "assistant-bubble" : "user-bubble"}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="chat-new-input">
          <input
            className="chatbot-input-text"
            type="text"
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button onClick={handleSubmit} className="chatbot-input-submit">
            <img
              src="/icons/arrow-circle-up-fill.svg"
              alt=""
              className="chatbot-input-submit-icon"
            />
          </button>
        </div>
      </main>

      {!hasMessages && (
        <div className="chat-new-agents">
          <header className="chat-new-agents-header">
            <p className="chat-new-agents-header-par">
              i don't replace actual doctors and googling images of resulting
              diagnose might be triggering
            </p>
            <Link href="#" className="chat-new-agents-header-link">
              <span className="chat-new-agents-link-header-span">
                learn more
              </span>
              <img
                src="/icons/caret-double-up.svg"
                alt=""
                className="chat-new-agents-header-link-icon"
              />
            </Link>
          </header>
          <div className="chat-new-agents-main">
            {agents.map((agent, index) => (
              <div key={index} className="chat-new-agents-main-wrapper">
                <div className="chat-new-agents-main-wrapper-column">
                  <p className="chat-new-agents-main-wrapper-column-desc">
                    {agent.desc}
                  </p>
                  <Link
                    className="chat-new-agents-main-wrapper-column-link"
                    href={agent.href}
                  >
                    <span className="chat-new-agents-main-wrapper-column-link-span">
                      learn more
                    </span>
                    <img
                      src="/icons/arrow-up-right.svg"
                      alt=""
                      className="chat-new-agents-main-wrapper-column-link-icon"
                    />
                  </Link>
                </div>
                <img
                  src={agent.imgSrc}
                  alt=""
                  className="chat-new-agents-main-wrapper-img"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
