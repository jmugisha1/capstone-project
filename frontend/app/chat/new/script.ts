"use client";
import { useState, useEffect } from "react";
import api from "../../lib/api";

const API = "https://mkkarekezi-testing-capstone.hf.space/api";

// --- API functions ---
export const getConversations = async (search?: string) => {
  const response = await api.get("/chat/conversations/", {
    params: search ? { search } : {},
  });
  return response.data;
};

export const createConversation = async () => {
  const response = await api.post("/chat/conversations/create/");
  return response.data;
};

export const getConversation = async (id: number) => {
  const response = await api.get(`/chat/conversations/${id}/`);
  return response.data;
};

export const sendMessage = async (id: number, content: string) => {
  const response = await api.post(`/chat/conversations/${id}/message/`, {
    content,
  });
  return response.data;
};

// --- Chat hook ---
export function useChatSession() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [stage, setStage] = useState<"start" | "questions" | "done">("start");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [sessionData, setSessionData] = useState({
    keywords: "",
    questions: [] as string[],
    answers: [] as string[],
    currentQ: 0,
  });

  useEffect(() => {
    createConversation()
      .then((conv) => setConversationId(conv.id))
      .catch((err) => console.error("Failed to create conversation", err));
  }, []);

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const saveMessage = async (content: string) => {
    if (!conversationId) return;
    try {
      await sendMessage(conversationId, content);
    } catch (err) {
      console.error("Failed to save message", err);
    }
  };

  const handleSend = async (input: string) => {
    if (!input.trim()) return;

    if (stage === "start") {
      addMessage("user", input);
      await saveMessage(input);
      addMessage("assistant", "Analyzing your symptoms...");

      const res = await fetch(`${API}/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      const initialMsg = `Initial Assessment:\n${data.initial_predictions
        .map(
          (p: any, i: number) =>
            `${i + 1}. ${p.disease} (${(p.confidence * 100).toFixed(1)}%)`,
        )
        .join(
          "\n",
        )}\n\nI have a few follow-up questions. Answer Yes or No.\n\n${data.questions[0]}`;

      setSessionData({
        keywords: data.keywords,
        questions: data.questions,
        answers: [],
        currentQ: 0,
      });
      setStage("questions");
      addMessage("assistant", initialMsg);
      await saveMessage(initialMsg);
      return;
    }

    if (stage === "questions") {
      const answer = input.toLowerCase();
      if (!["yes", "no", "y", "n"].includes(answer)) {
        addMessage("assistant", "Please answer Yes or No only.");
        return;
      }
      addMessage("user", input);
      await saveMessage(input);
      const updatedAnswers = [...sessionData.answers, answer];
      const nextQ = sessionData.currentQ + 1;

      if (nextQ < sessionData.questions.length) {
        setSessionData({
          ...sessionData,
          answers: updatedAnswers,
          currentQ: nextQ,
        });
        addMessage("assistant", sessionData.questions[nextQ]);
        await saveMessage(sessionData.questions[nextQ]);
      } else {
        addMessage("assistant", "Processing your final assessment...");
        const res = await fetch(`${API}/chat/answer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keywords: sessionData.keywords,
            questions: sessionData.questions,
            answers: updatedAnswers,
          }),
        });
        const data = await res.json();
        const finalMsg = `Final Assessment:\n${data.final_predictions
          .map(
            (p: any, i: number) =>
              `${i + 1}. ${p.disease} — ${(p.confidence * 100).toFixed(2)}% confidence`,
          )
          .join(
            "\n",
          )}\n\nThis is not a medical diagnosis. Please consult a qualified healthcare professional.`;
        addMessage("assistant", finalMsg);
        await saveMessage(finalMsg);
        setStage("done");
      }
    }

    if (stage === "done") {
      setMessages([]);
      setStage("start");
      setSessionData({ keywords: "", questions: [], answers: [], currentQ: 0 });
      try {
        const conv = await createConversation();
        setConversationId(conv.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return { messages, stage, handleSend };
}
