"use client";
import { useChatSession } from "./script";
import "./page.css";
import { useState, useRef, useEffect } from "react";
import { ChatNewHeader } from "../../_comp/_chat-new-header/ChatNewHeader";
import { ChatNewMessages } from "../../_comp/_chat-new-messages/ChatNewMessages";
import { ChatNewInput } from "../../_comp/_chat-new-input/ChatNewInput";

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

  const handleSubmit = () => {
    if (!text.trim()) return;
    handleSend(text.trim());
    setText("");
  };

  return (
    <div className="chat-main-outer">
      <ChatNewHeader name={formatHeaderName()} date={formatHeaderDate()} />
      <main
        className={`chat-new-main ${hasMessages ? "chat-new-main--active" : ""}`}
      >
        {!hasMessages ? (
          <h1 className="text-size-02">hello, how are you feeling today?</h1>
        ) : (
          <ChatNewMessages messages={messages} ref={messagesRef} />
        )}
        <ChatNewInput
          stage={stage}
          text={text}
          setText={setText}
          onSubmit={handleSubmit}
        />

        {!hasMessages && (
          <section className="chat-new-agents">agent here//</section>
        )}
      </main>
    </div>
  );
}
