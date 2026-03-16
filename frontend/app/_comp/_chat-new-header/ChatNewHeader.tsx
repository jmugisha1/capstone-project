"use client";
import "./ChatNewHeader.styles.css";
import "./ChatNewHeader.script";

type ChatNewHeaderProps = {
  name: string;
  date: string;
};

export function ChatNewHeader({ name, date }: ChatNewHeaderProps) {
  return (
    <header className="chat-new-header">
      <span className="text-size-03">{name}</span>
      <span className="text-size-03">{date}</span>
    </header>
  );
}
