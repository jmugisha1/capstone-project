"use client";
import Link from "next/link";
import { useChatHistory } from "./script";
import "./page.css";

export default function ChatHistory() {
  const {
    conversations,
    search,
    loading,
    handleSearch,
    handleNewChat,
    formatDate,
  } = useChatHistory();

  return (
    <main className="chat-history">
      <header className="chat-history-header">
        <img
          src="/icons/chats-circle.svg"
          alt=""
          className="chat-history-header-icon"
        />
        <h1 className="chat-history-header-title">chat history</h1>
      </header>

      <div className="chatbot-history-wrapper-main-subheader">
        <p className="chatbot-history-wrapper-main-subheader-par">
          all the chats with the curamedica will appear here
        </p>
        <button
          onClick={handleNewChat}
          className="chatbot-history-wrapper-main-subheader-link"
        >
          <img
            src="/icons/plus.svg"
            alt=""
            className="chatbot-history-wrapper-main-subheader-link-icon"
          />
          <span className="chatbot-history-wrapper-main-subheader-link-span">
            new chat
          </span>
        </button>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="chatbot-history-main-search"
      >
        <img
          src="/icons/magnifying-glass.svg"
          alt=""
          className="chatbot-history-main-search-icon"
        />
        <input
          type="text"
          placeholder="search your chats"
          className="chatbot-history-main-search-input"
          value={search}
          onChange={handleSearch}
        />
      </form>

      <div className="chatbot-history-wrapper-main-results">
        {loading ? (
          <p>Loading...</p>
        ) : conversations.length === 0 ? (
          <p>No chats found.</p>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              href={"/chat/" + conv.id}
              className="chatbot-history-wrapper-main-results-chat"
            >
              <p>{conv.title || "Consultation"}</p>
              <p>{formatDate(conv.created_at)}</p>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
