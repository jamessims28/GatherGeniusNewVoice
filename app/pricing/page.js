import BackButton from "../../components/BackButton";
import LivePricingPanel from "../../components/LivePricingPanel";

export default function PricingPage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Pricing</h1><span>Live Intelligence</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <LivePricingPanel />
      </section>
    </main>
  );
}
