import Link from "next/link";
import "./layout.css";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="chat-wrapper">
      <nav className="chat-wrapper-navigation">
        <main className="chat-wrapper-navigation-main">
          <button className="chat-wrapper-navigation-main-cta">
            <h1>cura-medica</h1>
            <img
              className="navigation-main-cta-icon"
              src="/icons/sidebar-simple.svg"
              alt=""
            />
          </button>
          <Link href="/chat/new" className="chat-wrapper-navigation-main-link">
            <span className="navigation-main-links-span">new chat</span>
            <img
              className="navigation-main-links-icons"
              src="/icons/chats-circle.svg"
              alt=""
            />
          </Link>
          <Link
            href="chat/reports"
            className="chat-wrapper-navigation-main-link"
          >
            <span className="navigation-main-links-span">reports</span>
            <img
              className="navigation-main-links-icons"
              src="/icons/file-text.svg"
              alt=""
            />
          </Link>
          <Link
            href="/chat/history"
            className="chat-wrapper-navigation-main-link"
          >
            <span className="navigation-main-links-span">chat history</span>
            <img
              className="navigation-main-links-icons"
              src="/icons/clock-counter-clockwise.svg"
              alt=""
            />
          </Link>

          <Link href="#" className="chat-wrapper-navigation-main-link">
            <span className="navigation-main-links-span">app settings</span>
            <img
              className="navigation-main-links-icons"
              src="/icons/sliders-horizontal.svg"
              alt=""
            />
          </Link>
        </main>
        <div className="navigation-account">
          <h1>user-name</h1>
        </div>
      </nav>

      <section className="chat-content">{children}</section>
    </div>
  );
}
