import BackButton from "../../components/BackButton";
import AutonomousHumanCorePanel from "../../components/AutonomousHumanCorePanel";

export default function HumanCorePage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Human Core</h1><span>Autonomous Intelligence</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <AutonomousHumanCorePanel />
      </section>
    </main>
  );
}
