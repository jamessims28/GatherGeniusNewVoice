"use client";
import { useState } from "react";
import BackButton from "../../components/BackButton";

export default function VendorPage() {
  const [message, setMessage] = useState("One decision: accept or decline.");
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Provider</h1><span>Execution request</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a><a className="gg-pill" href="/execution">Execution</a><a className="gg-pill" href="/investor">Investor</a></div>
      </nav>
      <section className="gg-section">
        <div className="gg-card">
          <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
            <h2>Experience Request</h2><span className="gg-status good">SLA 4 hrs</span>
          </div>
          <div className="gg-line"><span>Experience</span><strong>Luxury Wedding</strong></div>
          <div className="gg-line"><span>Guests</span><strong>120</strong></div>
          <div className="gg-line"><span>Payout</span><strong>$4,800</strong></div>
          <div className="gg-line"><span>Role</span><strong>Catering</strong></div>
          <div className="gg-grid2" style={{marginTop:18}}>
            <button className="gg-btn green" onClick={()=>setMessage("Accepted. Provider added to execution stack.")}>ACCEPT</button>
            <button className="gg-btn secondary" onClick={()=>setMessage("Declined. Backup provider activation starts automatically.")}>DECLINE</button>
          </div>
          <p className="gg-note">{message}</p>
        </div>
      </section>
    </main>
  );
}
