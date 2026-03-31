import "./styles.css";

export default function TermsOfUse() {
  return (
    <div className="terms-of-use">
      <h1>Terms of Use &amp; Privacy Policy</h1>
      <p className="subtitle">Cura-Medica — AI-Powered Healthcare Consultant</p>

      <div className="section">
        <h2>1. Scope of Service</h2>
        <p>
          Cura-Medica is an informational tool only. It does not provide medical
          diagnoses, prescribe medication, or replace professional medical
          advice. Always consult a qualified healthcare professional before
          making any medical decisions.
        </p>
      </div>

      <hr />

      <div className="section">
        <h2>2. Data We Collect</h2>
        <p>
          When you use the chatbot, we collect: your symptoms as described in
          the conversation, behavioural information (e.g. smoking, exercise),
          family disease history, and optional demographic details (name, age,
          gender). We also store your chat session history so you can access
          past reports.
        </p>
      </div>

      <hr />

      <div className="section">
        <h2>3. Third-Party Services</h2>
        <p>
          Your symptom text is sent to the NVIDIA API (Llama 3.3 70B) for
          keyword extraction only. Only anonymised, session-based text is
          transmitted — no personally identifiable information is shared with
          any third party.
        </p>
      </div>

      <hr />

      <div className="section">
        <h2>4. Data Storage &amp; Retention</h2>
        <p>
          Your data is stored in a secured PostgreSQL database. You may request
          deletion of your data at any time by contacting the developer. All
          data will be securely deleted at the conclusion of this project.
        </p>
      </div>

      <hr />

      <div className="section">
        <h2>5. Data Ownership &amp; Model Training</h2>
        <p>
          Your anonymised interaction data may be used to improve the machine
          learning model. No personally identifiable information will be linked
          to any training data.
        </p>
      </div>

      <hr />

      <div className="section">
        <h2>6. Limitation of Liability</h2>
        <p>
          The developers are not liable for any decisions made based on the
          system&#39;s output. Predictions are probabilistic and may be
          inaccurate. This tool is not a substitute for professional medical
          consultation.
        </p>
      </div>

      <hr />

      <div className="section">
        <h2>7. Your Rights</h2>
        <p>
          Participation and use of this system is voluntary. You may stop using
          the service at any time. You have the right to request access to,
          correction of, or deletion of your data.
        </p>
      </div>

      <div className="contact">
        <p>
          Contact:{" "}
          <a href="mailto:j.mugisha1@alustudent.com">
            j.mugisha1@alustudent.com
          </a>
        </p>
      </div>
    </div>
  );
}
