"use client";
import { useConversationDetail } from "./script";
import "./styles.css";

export default function ConversationPage() {
  const { convo, userName, loading, formatDate } = useConversationDetail();

  if (loading)
    return (
      <div className="chat-main-outer chat-main-inner">
        <div className="chat-loading">
          <img
            src="/icons/loader.svg"
            alt=""
            className="chat-loading-icon icon-size-01"
          />
          <span>loading</span>
        </div>
      </div>
    );

  return (
    <div
      className="chat-main-outer chat-main-inner"
      style={{ justifyContent: "space-between" }}
    >
      <div className="report-header">
        <h1 className="text-size-02">{convo?.title}</h1>
        <h3 className="chat-report-info-wrapper">
          <img src="/icons/text-aa.svg" alt="" />
          <span>{userName}</span>
        </h3>
        <h3 className="chat-report-info-wrapper">
          <img src="/icons/calendar-minus.svg" alt="" />
          <span>{formatDate()}</span>
        </h3>
      </div>

      <pre className="report-body">
        {[
          convo?.symptoms,
          convo?.initial_predictions
            ?.map(
              (p: any, i: number) =>
                `${i + 1}. ${p.disease} (${(p.confidence * 100).toFixed(1)}%)`,
            )
            .join("\n"),
          convo?.questions_answers
            ?.map((qa: any) => `${qa.question} — ${qa.answer}`)
            .join("\n"),
          convo?.final_predictions
            ?.map(
              (p: any, i: number) =>
                `${i + 1}. ${p.disease} — ${(p.confidence * 100).toFixed(2)}%`,
            )
            .join("\n"),
          convo?.specialist && `Recommended specialist: ${convo.specialist}`,
        ]
          .filter(Boolean)
          .join("\n\n")}
      </pre>

      <button className="chat-report-download">download report</button>
    </div>
  );
}
