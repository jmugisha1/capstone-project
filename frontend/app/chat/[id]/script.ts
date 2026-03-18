"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "../../_config/api";

export function useConversationDetail() {
  const { id } = useParams();
  const [convo, setConvo] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [conv, profile] = await Promise.all([
          api.get(`/chat/conversations/${id}/`),
          api.get("/auth/profile/"),
        ]);
        setConvo(conv.data);
        setUserName(profile.data.full_name);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatDate = () => {
    if (!convo?.created_at) return "";
    return new Date(convo.created_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return { convo, userName, loading, formatDate };
}
