import BackButton from "../../components/BackButton";
import RealtimeGeniusGatherCore from "../../components/RealtimeGeniusGatherCore";

export default function GeniusGatherPage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>GeniusGather</h1><span>Voice Assistant</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <RealtimeGeniusGatherCore />
      </section>
    </main>
  );
}
