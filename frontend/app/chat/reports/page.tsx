"use client";
import Link from "next/link";
import { useChatHistory } from "./script";
import "./page.css";

type Conversation = { id: number; title: string; created_at: string };

export default function ChatHistory() {
  const { conversations, search, loading, handleSearch, formatDate } =
    useChatHistory();

  return (
    <div className="chat-main-outer chat-main-inner">
      <h1 className="text-size-02">chat reports</h1>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="chat-history-search"
      >
        <img src="/icons/search.svg" alt="" className="icon-size-01" />
        <input
          type="text"
          placeholder="search your reports"
          className="text-size-04"
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
          conversations.map((conv: Conversation) => (
            <Link
              key={conv.id}
              href={"/chat/" + conv.id}
              className="chat-history-results-link"
            >
              <span className="text-size-05">
                {formatDate(conv.created_at)}
              </span>
              <span className="text-size-03">
                {conv.title || "Untitled"} — Diagnosis
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
