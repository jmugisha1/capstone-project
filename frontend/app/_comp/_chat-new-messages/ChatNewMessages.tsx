import "./ChatNewMessages.styles.css";
import { forwardRef } from "react";

type Message = { role: string; content: string };

export const ChatNewMessages = forwardRef<
  HTMLDivElement,
  { messages: Message[] }
>(({ messages }, ref) => (
  <div className="chat-new-messages" ref={ref}>
    {messages.map((msg, i) => (
      <div key={i} className={`chat-new-messages-${msg.role}`}>
        <span className="chat-new-messages-bubble-user text-size-04">
          {msg.content}
        </span>
      </div>
    ))}
  </div>
));
