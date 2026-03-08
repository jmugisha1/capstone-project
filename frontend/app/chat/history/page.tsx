"use client";
import Link from "next/link";
import { useChatHistory } from "./script";
import "./page.css";

export default function ChatHistory() {
  const { conversations, search, loading, handleSearch, formatDate } =
    useChatHistory();

  return (
    <div className="chat-history">
      <header className="chat-history-header">
        <img
          src="/icons/chats-circle.svg"
          alt=""
          className="chat-history-header-icon"
        />
        <h1 className="chat-history-header-title">chat history</h1>
      </header>

      <div className="chat-history-subheader">
        <p className="chat-history-subheader-par">
          all the chats with the curamedica will appear here
        </p>
        <Link className="chat-history-subheader-link" href="/chat/new">
          <img
            src="/icons/plus.svg"
            alt=""
            className="chat-history-subheader-link-icon"
          />
          <span className="chat-history-subheader-link-span">new chat</span>
        </Link>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="chat-history-search"
      >
        <img
          src="/icons/magnifying-glass.svg"
          alt=""
          className="chat-history-search-icon"
        />
        <input
          type="text"
          placeholder="search your chats"
          className="chat-history-search-input"
          value={search}
          onChange={handleSearch}
        />
      </form>

      <div className="chat-history-results">
        {loading ? (
          <p>Loading...</p>
        ) : conversations.length === 0 ? (
          <p>No chats found.</p>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              href={"/chat/" + conv.id}
              className="chat-history-results-link"
            >
              <p>{conv.title || "Consultation"}</p>
              <p>{formatDate(conv.created_at)}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
