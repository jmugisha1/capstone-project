"use client";
import { useState, useEffect } from "react";
import api from "../../lib/api";

export const getConversations = async (search?: string) => {
  const response = await api.get("/chat/conversations/", {
    params: search ? { search } : {},
  });
  return response.data;
};

export function useChatHistory() {
  const [conversations, setConversations] = useState<
    { id: number; title: string; created_at: string }[]
  >([]);
  [] > [];
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

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return { conversations, search, loading, handleSearch, formatDate };
}
