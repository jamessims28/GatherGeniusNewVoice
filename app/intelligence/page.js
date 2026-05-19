import BackButton from "../../components/BackButton";
import MultiSourceAnswerPanel from "../../components/MultiSourceAnswerPanel";

export default function IntelligencePage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Intelligence</h1><span>Multi-source Answers</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <MultiSourceAnswerPanel />
      </section>
    </main>
  );
}
