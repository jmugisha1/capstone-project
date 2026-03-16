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
  const [isDark, setIsDark] = useState(false);
  const [profile, setProfile] = useState({ full_name: "", email: "" });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);

    getProfile()
      .then((data) =>
        setProfile({ full_name: data.full_name, email: data.email }),
      )
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("theme-change"));
  };

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
      localStorage.removeItem("theme");
      window.dispatchEvent(new Event("theme-change"));
      router.push("/auth/sign-in");
    }
  };

  return { isDark, profile, toggleTheme, handleLogout };
}
