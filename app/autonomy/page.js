import BackButton from "../../components/BackButton";
import AutonomousExperienceLayerPanel from "../../components/AutonomousExperienceLayerPanel";

export default function AutonomyPage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Autonomy</h1><span>20-Year Layer</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <AutonomousExperienceLayerPanel />
      </section>
    </main>
  );
}
