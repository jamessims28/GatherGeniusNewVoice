import BackButton from "../../components/BackButton";
import InteractiveExchangePanel from "../../components/InteractiveExchangePanel";

export default function ExchangePage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Exchange</h1><span>Conversation Intelligence</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <InteractiveExchangePanel />
      </section>
    </main>
  );
}
