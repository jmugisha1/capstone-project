"use client";
import { useState, useEffect } from "react";
import api from "../../_config/api";
import {
  formatHeaderName,
  formatHeaderDate,
} from "../../_comp/_chat-new-header/ChatNewHeader.script";

// ─── Constants ────────────────────────────────────────────
const API = "https://mkkarekezi-testing-capstone.hf.space/api";

// ─── Types ────────────────────────────────────────────────
export type QuestionItem = {
  disease: string;
  symptom: string;
  question: string;
};

export type Message = {
  role: string;
  content: string;
};

export type Stage = "start" | "questions" | "done";

export type SessionData = {
  keywords: string;
  questions: QuestionItem[];
  answers: string[];
  currentQ: number;
};

// ─── API ──────────────────────────────────────────────────
const createConversation = async () => {
  const res = await api.post("/chat/conversations/create/");
  return res.data;
};

const sendMessage = async (
  id: number,
  content: string,
  role: string = "user",
) => {
  const res = await api.post(`/chat/conversations/${id}/message/`, {
    content,
    role,
  });
  return res.data;
};

const updateConversationTitle = async (id: number, title: string) => {
  const res = await api.post(`/chat/conversations/${id}/title/`, { title });
  return res.data;
};

const getProfile = async () => {
  const res = await api.get("/auth/profile/");
  return res.data;
};

// ─── Hook ─────────────────────────────────────────────────
export function useChatSession() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<Stage>("start");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData>({
    keywords: "",
    questions: [],
    answers: [],
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

  const resetSession = () => {
    setMessages([]);
    setStage("start");
    setStartedAt(null);
    setConversationId(null);
    setSessionData({ keywords: "", questions: [], answers: [], currentQ: 0 });
  };

  const handleSend = async (input: string) => {
    if (!input.trim()) return;

    // ── Stage: start ──
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

      const questions: QuestionItem[] = data.questions ?? [];
      const skipFollowup: boolean = data.skip_followup ?? false;
      const specialist: string = data.specialist ?? "";

      const initialPredictions = (data.initial_predictions ?? [])
        .map(
          (p: { disease: string; confidence: number }, i: number) =>
            `${i + 1}. ${p.disease} (${(p.confidence * 100).toFixed(1)}%)`,
        )
        .join("\n");

      if (skipFollowup || questions.length === 0) {
        const topDisease = data.initial_predictions?.[0]?.disease ?? "Unknown";
        await updateConversationTitle(convId, topDisease);

        const finalMsg =
          `Initial Assessment:\n${initialPredictions}` +
          (specialist ? `\n\nRecommended specialist: ${specialist}` : "") +
          `\n\nThis is not a medical diagnosis. Please consult a qualified healthcare professional.`;

        addMessage("assistant", finalMsg);
        await saveMessage(convId, finalMsg, "assistant");
        setStage("done");
        return;
      }

      const initialMsg =
        `Initial Assessment:\n${initialPredictions}` +
        `\n\nI have a few follow-up questions. Answer Yes or No.\n\n` +
        questions[0].question;

      setSessionData({
        keywords: data.keywords,
        questions,
        answers: [],
        currentQ: 0,
      });
      setStage("questions");
      addMessage("assistant", initialMsg);
      await saveMessage(convId, initialMsg, "assistant");
      return;
    }

    // ── Stage: questions ──
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
        const nextQuestion = sessionData.questions[nextQ].question;
        setSessionData({
          ...sessionData,
          answers: updatedAnswers,
          currentQ: nextQ,
        });
        addMessage("assistant", nextQuestion);
        if (conversationId)
          await saveMessage(conversationId, nextQuestion, "assistant");
        return;
      }

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

      const topDisease = data.final_predictions?.[0]?.disease ?? "Unknown";
      const specialist: string = data.specialist ?? "";

      if (conversationId)
        await updateConversationTitle(conversationId, topDisease);

      const finalPredictions = (data.final_predictions ?? [])
        .map(
          (p: { disease: string; confidence: number }, i: number) =>
            `${i + 1}. ${p.disease} — ${(p.confidence * 100).toFixed(2)}% confidence`,
        )
        .join("\n");

      const finalMsg =
        `Final Assessment:\n${finalPredictions}` +
        (specialist ? `\n\nRecommended specialist: ${specialist}` : "") +
        `\n\nThis is not a medical diagnosis. Please consult a qualified healthcare professional.`;

      addMessage("assistant", finalMsg);
      if (conversationId)
        await saveMessage(conversationId, finalMsg, "assistant");
      setStage("done");
      return;
    }

    // ── Stage: done ──
    if (stage === "done") resetSession();
  };

  return {
    messages,
    stage,
    handleSend,
    formatHeaderName: () =>
      formatHeaderName(hasStarted, userName, conversationId),
    formatHeaderDate: () => formatHeaderDate(startedAt),
  };
}
