import BackButton from "../../components/BackButton";
import RealtimeConversationCore from "../../components/RealtimeConversationCore";

export default function ComfortPage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Comfort Voice</h1><span>Friend-like AI</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <div className="gg-card">
          <span className="gg-status good">Adaptive Tone</span>
          <h2 style={{ marginTop: 16 }}>Genius listens like a friend.</h2>
          <p className="gg-note">The voice changes pace, warmth, and directness based on stress, excitement, urgency, and comfort.</p>
          <RealtimeConversationCore />
        </div>
      </section>
    </main>
  );
}
