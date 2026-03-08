"use client";
import { useState, useEffect } from "react";
import api from "../../lib/api";

const API = "https://mkkarekezi-testing-capstone.hf.space/api";

// --- API ---
export const createConversation = async () => {
  const response = await api.post("/chat/conversations/create/");
  return response.data;
};

export const sendMessage = async (
  id: number,
  content: string,
  role: string = "user",
) => {
  const response = await api.post(`/chat/conversations/${id}/message/`, {
    content,
    role,
  });
  return response.data;
};

export const updateConversationTitle = async (id: number, title: string) => {
  const response = await api.post(`/chat/conversations/${id}/title/`, {
    title,
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile/");
  return response.data;
};

// --- Hook ---
export function useChatSession() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [stage, setStage] = useState<"start" | "questions" | "done">("start");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState({
    keywords: "",
    questions: [] as string[],
    answers: [] as string[],
    currentQ: 0,
  });

  const hasStarted = messages.length > 0;

  useEffect(() => {
    getProfile()
      .then((profile) => setUserName(profile.full_name))
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const saveMessage = async (
    id: number,
    content: string,
    role: string = "user",
  ) => {
    try {
      await sendMessage(id, content, role);
    } catch (err) {
      console.error("Failed to save message", err);
    }
  };

  const formatHeaderName = () => {
    if (!hasStarted) return "Untitled Diagnosis";
    const names = userName ? userName.split(" ").slice(0, 2).join(" ") : "User";
    return `${names} — Diagnosis #${conversationId ?? "..."}`;
  };

  const formatHeaderDate = () => {
    const date = startedAt ? new Date(startedAt) : new Date();
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSend = async (input: string) => {
    if (!input.trim()) return;

    if (stage === "start") {
      setStartedAt(new Date().toISOString());
      addMessage("user", input);

      let convId = conversationId;
      if (!convId) {
        try {
          const conv = await createConversation();
          convId = conv.id;
          setConversationId(conv.id);
        } catch (err) {
          console.error("Failed to create conversation", err);
          return;
        }
      }

      if (!convId) return;

      await saveMessage(convId, input, "user");
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
      await saveMessage(convId, initialMsg, "assistant");
      return;
    }

    if (stage === "questions") {
      const answer = input.toLowerCase();
      if (!["yes", "no", "y", "n"].includes(answer)) {
        addMessage("assistant", "Please answer Yes or No only.");
        return;
      }
      addMessage("user", input);
      if (conversationId) await saveMessage(conversationId, input, "user");
      const updatedAnswers = [...sessionData.answers, answer];
      const nextQ = sessionData.currentQ + 1;

      if (nextQ < sessionData.questions.length) {
        setSessionData({
          ...sessionData,
          answers: updatedAnswers,
          currentQ: nextQ,
        });
        addMessage("assistant", sessionData.questions[nextQ]);
        if (conversationId)
          await saveMessage(
            conversationId,
            sessionData.questions[nextQ],
            "assistant",
          );
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

        const topDisease = data.final_predictions[0]?.disease || "Unknown";
        const dateStr = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        if (conversationId) {
          await updateConversationTitle(
            conversationId,
            `${topDisease} — ${dateStr}`,
          );
        }

        const finalMsg = `Final Assessment:\n${data.final_predictions
          .map(
            (p: any, i: number) =>
              `${i + 1}. ${p.disease} — ${(p.confidence * 100).toFixed(2)}% confidence`,
          )
          .join(
            "\n",
          )}\n\nThis is not a medical diagnosis. Please consult a qualified healthcare professional.`;
        addMessage("assistant", finalMsg);
        if (conversationId)
          await saveMessage(conversationId, finalMsg, "assistant");
        setStage("done");
      }
    }

    if (stage === "done") {
      setMessages([]);
      setStage("start");
      setStartedAt(null);
      setConversationId(null);
      setSessionData({ keywords: "", questions: [], answers: [], currentQ: 0 });
    }
  };

  return { messages, stage, handleSend, formatHeaderName, formatHeaderDate };
}
