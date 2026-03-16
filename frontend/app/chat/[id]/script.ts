"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "../../_config/api";

export const getConversation = async (id: number) => {
  const response = await api.get(`/chat/conversations/${id}/`);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile/");
  return response.data;
};

export function useConversationDetail() {
  const { id } = useParams();
  const [messages, setMessages] = useState<
    { id: number; role: string; content: string; created_at: string }[]
  >([]);
  [] > [];
  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [conv, profile] = await Promise.all([
          getConversation(Number(id)),
          getProfile(),
        ]);
        setMessages(conv.messages);
        setTitle(conv.title);
        setCreatedAt(conv.created_at);
        setUserName(profile.full_name);
        setUserEmail(profile.email);
      } catch (err) {
        console.error("Failed to load conversation", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getSymptoms = () => {
    const first = messages.find((m) => m.role === "user");
    return first?.content || "N/A";
  };

  const getInitialAssessment = () => {
    const msg = messages.find(
      (m) => m.role === "assistant" && m.content.includes("Initial Assessment"),
    );
    return msg?.content || "";
  };

  const getFinalAssessment = () => {
    const msg = messages.find(
      (m) => m.role === "assistant" && m.content.includes("Final Assessment"),
    );
    return msg?.content || "";
  };

  const getQuestionsAndAnswers = () => {
    const pairs: { question: string; answer: string }[] = [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (
        msg.role === "assistant" &&
        !msg.content.includes("Initial Assessment") &&
        !msg.content.includes("Final Assessment") &&
        !msg.content.includes("Analyzing") &&
        !msg.content.includes("Processing")
      ) {
        const answer = messages[i + 1];
        if (answer && answer.role === "user") {
          pairs.push({ question: msg.content, answer: answer.content });
        }
      }
    }
    return pairs;
  };

  const formatDate = () => {
    if (!createdAt) return "";
    return new Date(createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = () => {
    if (!createdAt) return "";
    return new Date(createdAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return {
    title,
    userName,
    userEmail,
    loading,
    getSymptoms,
    getInitialAssessment,
    getFinalAssessment,
    getQuestionsAndAnswers,
    formatDate,
    formatTime,
    conversationId: id,
  };
}
