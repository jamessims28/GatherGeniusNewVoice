import BackButton from "../../components/BackButton";
import SpeakingSpark from "../../components/SpeakingSpark";

export default function VoicePage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Voice Spark</h1><span>Speaking Identity</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a><a className="gg-pill" href="/permissions">Permissions</a></div>
      </nav>

      <section className="gg-section">
        <SpeakingSpark />
        <div className="gg-card">
          <span className="gg-status good">Voice Evolution</span>
          <h2 style={{ marginTop: 16 }}>The light spark becomes the voice of GatherGenius.</h2>
          <p className="gg-note">
            When the system speaks, listens, confirms, or guides execution, the spark glows and pulses so users can feel that the Experience OS is alive and responding.
          </p>
          <div className="gg-grid3" style={{ marginTop: 18 }}>
            <div className="gg-metric"><span>Listening</span><strong>Soft Pulse</strong></div>
            <div className="gg-metric"><span>Speaking</span><strong>Wave Glow</strong></div>
            <div className="gg-metric"><span>Confirmed</span><strong>Bright Spark</strong></div>
          </div>
        </div>
      </section>
    </main>
  );
}
