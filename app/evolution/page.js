import BackButton from "../../components/BackButton";

export default function EvolutionPage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Background AI</h1><span>Hidden Intelligence Layer</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <div className="gg-card">
          <span className="gg-status good">Running Quietly</span>
          <h2 style={{ marginTop: 16 }}>The 1–10 AI stack now runs in the background.</h2>
          <p className="gg-note">The user-facing experience is now simple: AI voice produces results. The intelligence stack stays hidden.</p>
        </div>
      </section>
    </main>
  );
}
