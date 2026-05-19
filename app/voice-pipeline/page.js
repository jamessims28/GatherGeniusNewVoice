import BackButton from "../../components/BackButton";
import VoiceOutcomePipelinePanel from "../../components/VoiceOutcomePipelinePanel";

export default function VoicePipelinePage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Voice Pipeline</h1><span>Outcome Delivery</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <VoiceOutcomePipelinePanel />
      </section>
    </main>
  );
}
