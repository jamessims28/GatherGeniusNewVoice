import BackButton from "../../components/BackButton";
import ExperienceOperatingLayerPanel from "../../components/ExperienceOperatingLayerPanel";

export default function OperatingLayerPage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Operating Layer</h1><span>Real-world Outcomes</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <ExperienceOperatingLayerPanel />
      </section>
    </main>
  );
}
