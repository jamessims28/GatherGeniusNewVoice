
"use client";

import { useState } from "react";

export default function GeniusShieldStatus() {
  const [message, setMessage] = useState("GeniusShield is active.");
  const [checking, setChecking] = useState(false);

  async function runCheck() {
    setChecking(true);
    try {
      const response = await fetch("/api/security/genius-shield/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "safe system check", path: "/security" })
      });
      const data = await response.json();
      setMessage(data.message || "GeniusShield check complete.");
    } catch {
      setMessage("GeniusShield could not complete the check, but middleware protections remain active.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="gg-shield-status">
      <span className="gg-status good">GeniusShield</span>
      <p className="gg-note">{message}</p>
      <button className="gg-btn secondary" type="button" onClick={runCheck} disabled={checking}>
        {checking ? "CHECKING..." : "CHECK DEFENSE"}
      </button>
    </div>
  );
}
