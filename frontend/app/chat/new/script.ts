"use client";
import { useState, useEffect } from "react";
import api from "../../_config/api";
import {
  formatHeaderName,
  formatHeaderDate,
} from "../../_comp/_chat-new-header/ChatNewHeader.script";

const API = "https://mkkarekezi-testing-capstone.hf.space/api";

export type QuestionItem = {
  disease: string;
  symptom: string;
  question: string;
};
export type Message = { role: string; content: string };
export type Stage = "start" | "questions" | "done";

const createConversation = async () =>
  (await api.post("/chat/conversations/create/")).data;
const saveConversation = async (id: number, data: object) =>
  (await api.post(`/chat/conversations/${id}/save/`, data)).data;
const getProfile = async () => (await api.get("/auth/profile/")).data;

export function useChatSession() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<Stage>("start");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState({
    keywords: "",
    questions: [] as QuestionItem[],
    answers: [] as string[],
    currentQ: 0,
    symptoms: "",
    initialPredictions: [] as any[],
  });

  const hasStarted = messages.length > 0;

  useEffect(() => {
    getProfile()
      .then((p) => setUserName(p.full_name))
      .catch(console.error);
  }, []);

  const addMessage = (role: "user" | "assistant", content: string) =>
    setMessages((prev) => [...prev, { role, content }]);

  const resetSession = () => {
    setMessages([]);
    setStage("start");
    setStartedAt(null);
    setConversationId(null);
    setSessionData({
      keywords: "",
      questions: [],
      answers: [],
      currentQ: 0,
      symptoms: "",
      initialPredictions: [],
    });
  };

  const handleSend = async (input: string) => {
    if (!input.trim()) return;

    if (stage === "start") {
      setStartedAt(new Date().toISOString());
      addMessage("user", input);

      let convId = conversationId;
      if (!convId) {
        const conv = await createConversation();
        convId = conv.id;
        setConversationId(conv.id);
      }
      if (!convId) return;

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
      const initialPredictions = data.initial_predictions ?? [];

      if (skipFollowup || questions.length === 0) {
        const topDisease = initialPredictions[0]?.disease ?? "Unknown";
        await saveConversation(convId, {
          title: topDisease,
          symptoms: input,
          initial_predictions: initialPredictions,
          questions_answers: [],
          final_predictions: initialPredictions,
          specialist,
        });

        addMessage(
          "assistant",
          `Initial Assessment:\n${initialPredictions.map((p: any, i: number) => `${i + 1}. ${p.disease} (${(p.confidence * 100).toFixed(1)}%)`).join("\n")}` +
            (specialist ? `\n\nRecommended specialist: ${specialist}` : "") +
            `\n\nThis is not a medical diagnosis. Please consult a qualified healthcare professional.`,
        );
        setStage("done");
        return;
      }

      setSessionData({
        keywords: data.keywords,
        questions,
        answers: [],
        currentQ: 0,
        symptoms: input,
        initialPredictions,
      });
      setStage("questions");
      addMessage(
        "assistant",
        `Initial Assessment:\n${initialPredictions.map((p: any, i: number) => `${i + 1}. ${p.disease} (${(p.confidence * 100).toFixed(1)}%)`).join("\n")}` +
          `\n\nI have a few follow-up questions. Answer Yes or No.\n\n${questions[0].question}`,
      );
      return;
    }

    if (stage === "questions") {
      const answer = input.toLowerCase();
      if (!["yes", "no", "y", "n"].includes(answer)) {
        addMessage("assistant", "Please answer Yes or No only.");
        return;
      }

      addMessage("user", input);
      const updatedAnswers = [...sessionData.answers, answer];
      const nextQ = sessionData.currentQ + 1;

      if (nextQ < sessionData.questions.length) {
        setSessionData({
          ...sessionData,
          answers: updatedAnswers,
          currentQ: nextQ,
        });
        addMessage("assistant", sessionData.questions[nextQ].question);
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

      const finalPredictions = data.final_predictions ?? [];
      const specialist: string = data.specialist ?? "";
      const topDisease = finalPredictions[0]?.disease ?? "Unknown";
      const questionsAnswers = sessionData.questions.map((q, i) => ({
        question: q.question,
        answer: updatedAnswers[i],
      }));

      if (conversationId) {
        await saveConversation(conversationId, {
          title: topDisease,
          symptoms: sessionData.symptoms,
          initial_predictions: sessionData.initialPredictions,
          questions_answers: questionsAnswers,
          final_predictions: finalPredictions,
          specialist,
        });
      }

      addMessage(
        "assistant",
        `Final Assessment:\n${finalPredictions.map((p: any, i: number) => `${i + 1}. ${p.disease} — ${(p.confidence * 100).toFixed(2)}% confidence`).join("\n")}` +
          (specialist ? `\n\nRecommended specialist: ${specialist}` : "") +
          `\n\nThis is not a medical diagnosis. Please consult a qualified healthcare professional.`,
      );
      setStage("done");
      return;
    }

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
