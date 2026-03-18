"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import api from "../../_config/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function useConversationDetail() {
  const { id } = useParams();
  const [convo, setConvo] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLElement>(null);

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
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const element = reportRef.current;

    // Save original styles
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;

    // Expand to full content height before capture
    element.style.height = element.scrollHeight + "px";
    element.style.overflow = "visible";

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Restore original styles
    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${convo?.title ?? "report"} - ${userName}.pdf`);
  };

  return { convo, userName, loading, formatDate, reportRef, downloadPDF };
}

// ehhe
