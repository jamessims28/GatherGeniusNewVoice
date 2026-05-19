import BackButton from "../../components/BackButton";
import SourceAwareCodeForge from "../../components/SourceAwareCodeForge";

export default function CodeForgePage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Code Forge</h1><span>Source-aware Build Engine</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <SourceAwareCodeForge />
      </section>
    </main>
  );
}
