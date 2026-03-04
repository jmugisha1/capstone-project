"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "../../components/navigation/navigation-component";
import { ChatbotNavigation } from "../../components/chatbot-navigation/chatbot-navigation-component";
import { getConversation } from "../config/chat-config";

export default function ConversationPage() {
  const { id } = useParams();
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getConversation(Number(id));
        setConversation(data);
      } catch (err) {
        console.error("Failed to load conversation", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  return (
    <div className="chat-wrapper">
      <Navigation />
      <main className="chat-wrapper-main">
        <ChatbotNavigation />
        <div className="chatbot-response">
          {loading ? (
            <p>Loading...</p>
          ) : !conversation ? (
            <p>Conversation not found.</p>
          ) : (
            <>
              <h2>{conversation.title}</h2>
              {conversation.messages.map((msg: any) => (
                <div key={msg.id} className={`message message--${msg.role}`}>
                  <div
                    className={`message-bubble ${msg.role === "assistant" ? "assistant-bubble" : "user-bubble"}`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
