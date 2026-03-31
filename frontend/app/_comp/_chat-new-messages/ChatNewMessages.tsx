import "./ChatNewMessages.styles.css";

type Message = { role: string; content: string };

export const ChatNewMessages = ({ messages }: { messages: Message[] }) => (
  <div className="chat-new-messages">
    {messages.map((msg, i) => (
      <span key={i} className={`chat-new-messages-${msg.role} text-size-04`}>
        {msg.content}
      </span>
    ))}
  </div>
);
