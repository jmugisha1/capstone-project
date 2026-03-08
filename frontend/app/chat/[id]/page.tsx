"use client";
import { useConversationDetail } from "./script";
import "./styles.css";

export default function ConversationPage() {
  const {
    title,
    userName,
    loading,
    getSymptoms,
    getInitialAssessment,
    getFinalAssessment,
    getQuestionsAndAnswers,
    formatDate,
    formatTime,
    conversationId,
  } = useConversationDetail();

  if (loading)
    return (
      <div className="report">
        <p>Loading...</p>
      </div>
    );

  const qaPairs = getQuestionsAndAnswers();
  const initialAssessment = getInitialAssessment();
  const finalAssessment = getFinalAssessment();

  return (
    <div className="chat-report">
      <div className="chat-report-title">
        <h3 className="chat-report-title-h3">
          cura-medica - medical report #{conversationId}
        </h3>
        <h3 className="chat-report-title-h3">{formatTime()}</h3>
      </div>

      <main className="chat-report-wrapper">
        <header className="chat-report-wrapper-header">
          <h1 className="chat-report-wrapper-header-disease">
            <img src="/icons/file.svg" alt="" />
            <span>{title}</span>
          </h1>

          <div className="chat-report-wrapper-details">
            <h3 className="chat-report-wrapper-details-title">
              <img src="/icons/person-arms-spread.svg" alt="" />
              <span>full names</span>
            </h3>
            <h3 className="chat-report-details-data">{userName}</h3>
          </div>

          <div className="chat-report-wrapper-details">
            <h3 className="chat-report-wrapper-details-title">
              <img src="/icons/calendar-minus.svg" alt="" />
              <span>date</span>
            </h3>
            <h3 className="chat-report-details-data">{formatDate()}</h3>
          </div>

          <div className="chat-report-wrapper-details">
            <h3 className="chat-report-wrapper-details-title">
              <img src="/icons/hand-pointing.svg" alt="" />
              <span>actions</span>
            </h3>
            <div className="chat-report-details-cta">
              <button className="chat-report-details-cta-delete">
                delete report
              </button>
              <button className="chat-report-details-cta-delete">
                download report
              </button>
            </div>
          </div>
        </header>

        <div className="report-divider" />

        {initialAssessment && (
          <>
            <section className="report-section">
              <h2 className="report-section-title">Initial Assessment</h2>
              <pre className="report-section-content">{initialAssessment}</pre>
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
      </main>
    </div>
  );
}
