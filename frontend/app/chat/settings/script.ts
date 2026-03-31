"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../_config/api";

export const getProfile = async () => {
  const response = await api.get("/auth/profile/");
  return response.data;
};

export function useSettings() {
  const router = useRouter();
  const [profile, setProfile] = useState({ full_name: "", email: "" });

  useEffect(() => {
    const cached = localStorage.getItem("profile");
    if (cached) setProfile(JSON.parse(cached));

    getProfile()
      .then((data) => {
        const p = { full_name: data.full_name, email: data.email };
        setProfile(p);
        localStorage.setItem("profile", JSON.stringify(p));
      })
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await api.post("/auth/logout/", { refresh });
      }
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("profile");
      router.push("/auth/sign-in");
    }
  };

  return { profile, handleLogout };
}
