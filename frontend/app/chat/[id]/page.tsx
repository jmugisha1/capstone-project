"use client";
import { useConversationDetail } from "./script";
import "./styles.css";

export default function ConversationPage() {
  const { convo, userName, loading, formatDate, reportRef, downloadPDF } =
    useConversationDetail();

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
      <main className="chat-report" ref={reportRef}>
        <div className="chat-report-header">
          <h1 className="text-size-02">{convo?.title}</h1>
          <div className="chat-report-header-wrapper">
            <img src="/icons/user-round.svg" alt="" />
            <span className="text-size-03">{userName}</span>
          </div>
          <h3 className="chat-report-header-wrapper">
            <img src="/icons/calendar.svg" alt="" className="icon-size-02" />
            <span className="text-size-03">{formatDate()}</span>
          </h3>
        </div>

        <div className="chat-report-divider">
          <span className="text-size-05">user medical diagnosis report</span>
        </div>

        <div className="report-report-body">
          <p className="text-size-04">user&nbsp;--&nbsp;{convo?.symptoms}</p>
          <p className="text-size-04">
            Initial Diagnosis&nbsp;--&nbsp;
            {convo?.initial_predictions
              ?.map(
                (p: any) =>
                  `${p.disease} (${(p.confidence * 100).toFixed(1)}%)`,
              )
              .join(" -- ")}
          </p>

          <p className="text-size-04">
            Follow-up&nbsp;--&nbsp;
            {convo?.questions_answers
              ?.map((qa: any) => `${qa.question} — ${qa.answer}`)
              .join(" -- ")}
          </p>

          <p className="text-size-04">
            Final Assessment&nbsp;--&nbsp;
            {convo?.final_predictions
              ?.map(
                (p: any) =>
                  `${p.disease} (${(p.confidence * 100).toFixed(2)}%)`,
              )
              .join(" -- ")}
          </p>

          {convo?.specialist && (
            <p className="text-size-04">
              Recommended Specialist&nbsp;--&nbsp;{convo.specialist}
            </p>
          )}
        </div>
        <span className="text-size-03">cura medica</span>
      </main>

      <button
        className="chat-report-download text-size-03"
        onClick={downloadPDF}
      >
        downloaf report
      </button>
    </div>
  );
}
