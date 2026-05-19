
import BackButton from "../../components/BackButton";
import GeniusShieldStatus from "../../components/GeniusShieldStatus";

export default function SecurityPage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>GeniusShield</h1><span>Defensive Mode</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <div className="gg-card">
          <span className="gg-status good">Active Defense</span>
          <h2 style={{ marginTop: 16 }}>Block. Log. Alert. Preserve evidence.</h2>
          <p className="gg-note">GeniusShield safely defends the platform without retaliating. Suspicious requests are blocked and logged for review.</p>
          <GeniusShieldStatus />
        </div>
      </section>
    </main>
  );
}
