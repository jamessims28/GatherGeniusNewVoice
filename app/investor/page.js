import BackButton from "../../components/BackButton";

export default function InvestorPage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Investor</h1><span>Proof dashboard</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a><a className="gg-pill" href="/execution">Execution</a><a className="gg-pill" href="/vendor">Provider</a></div>
      </nav>
      <section className="gg-section">
        <div className="gg-card">
          <span className="gg-status good">Investor Proof</span>
          <h2 style={{ marginTop: 16 }}>GatherGenius removes planning.</h2>
          <p className="gg-note">The platform converts one sentence or taps into a locked experience outcome and executes it with providers, backups, SLA, payments, and data feedback.</p>
          <div className="gg-grid4" style={{ marginTop: 22 }}>
            <div className="gg-metric"><span>Customer Decisions</span><strong>1</strong></div>
            <div className="gg-metric"><span>Confidence</span><strong>94%</strong></div>
            <div className="gg-metric"><span>Backup Coverage</span><strong>100%</strong></div>
            <div className="gg-metric"><span>Planning</span><strong>Eliminated</strong></div>
          </div>
        </div>
      </section>
    </main>
  );
}
