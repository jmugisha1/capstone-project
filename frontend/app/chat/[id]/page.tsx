"use client";
import { useConversationDetail } from "./script";
import "./styles.css";

export default function ConversationPage() {
  const {
    title,
    userName,
    loading,
    getInitialAssessment,
    getFinalAssessment,
    getQuestionsAndAnswers,
    formatDate,
  } = useConversationDetail();

  const qaPairs = getQuestionsAndAnswers();
  const initialAssessment = getInitialAssessment();
  const finalAssessment = getFinalAssessment();

  return (
    <div
      className="chat-main-outer chat-main-inner"
      style={{ justifyContent: "space-between" }}
    >
      <h1 className="text-size-02">{title || "Loading..."}</h1>

      {loading ? (
        <div className="chat-report-spinner">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div className="chat-report-info">
            <h3 className="chat-report-info-wrapper">
              <img src="/icons/text-aa.svg" alt="" />
              <span>{userName}</span>
            </h3>
            <h3 className="chat-report-info-wrapper">
              <img src="/icons/calendar-minus.svg" alt="" />
              <span>{formatDate()}</span>
            </h3>
          </div>

          {initialAssessment && (
            <>
              <section className="report-section">
                <h2 className="report-section-title">Initial Assessment</h2>
                <pre className="report-section-content">
                  {initialAssessment}
                </pre>
              </section>
              <div className="report-divider" />
            </>
          )}

          {qaPairs.length > 0 && (
            <>
              <section className="report-section">
                <h2 className="report-section-title">Follow-up Questions</h2>
                <div className="report-qa">
                  {qaPairs.map((qa, i) => (
                    <p key={i} className="report-qa-item">
                      {qa.question} — <strong>{qa.answer}</strong>
                    </p>
                  ))}
                </div>
              </section>
              <div className="report-divider" />
            </>
          )}

          {finalAssessment && (
            <section className="report-section report-final">
              <h2 className="report-section-title">Final Assessment</h2>
              <pre className="report-section-content">{finalAssessment}</pre>
            </section>
          )}

          <button className="chat-report-download">download report</button>
        </>
      )}
    </div>
  );
}
