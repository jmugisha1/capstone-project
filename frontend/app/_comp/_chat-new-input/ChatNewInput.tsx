"use client";
import "./ChatNewInput.styles.css";
import { getPlaceholder } from "./ChatNewInput.script";

type ChatNewInputProps = {
  stage: string;
  text: string;
  setText: (val: string) => void;
  onSubmit: () => void;
};

export function ChatNewInput({
  stage,
  text,
  setText,
  onSubmit,
}: ChatNewInputProps) {
  const placeholder = getPlaceholder(stage);

  return (
    <div className="chat-new-input">
      <input
        className="text-size-04 chat-new-input-place"
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
      />
      <button onClick={onSubmit} className="chatbot-input-submit">
        <img src="/icons/circle-arrow-up.svg" alt="" className="icon-size-01" />
      </button>
    </div>
  );
}
