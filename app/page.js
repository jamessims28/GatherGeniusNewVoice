"use client";

import RealtimeConversationCore from "../components/RealtimeConversationCore";

export default function Page() {
  return (
    <main className="gg-shell gg-minimal-shell">
      <section className="gg-guide-landing">
        <div className="gg-guide-center">
          <div className="gg-guide-spark">
            <span />
          </div>

          <span className="gg-status good">
            GeniusGather is ready
          </span>

          <h1>
            Talk naturally.
            <span> Genius will guide you.</span>
          </h1>

          <p>
            No forms. No visible systems. Just conversation.
          </p>

          <RealtimeConversationCore />
        </div>
      </section>
    </main>
  );
}
