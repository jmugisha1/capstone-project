"use client";
import { useState, useEffect } from "react";
import api from "../../_config/api";

type Conversation = { id: number; title: string; created_at: string };

const getConversations = async (search?: string) => {
  const response = await api.get("/chat/conversations/", {
    params: search ? { search } : {},
  });
  return response.data;
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const getTodayDate = () =>
  new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export function useChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async (query?: string) => {
    try {
      setLoading(true);
      const data = await getConversations(query);
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchConversations(e.target.value);
  };

  return {
    conversations,
    search,
    loading,
    handleSearch,
    formatDate,
    todayDate: getTodayDate(),
  };
}
