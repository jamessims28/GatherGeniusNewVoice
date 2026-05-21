
export function createAmbientListeningLoop({ voiceCore, intervalMs = 2000, onPulse } = {}) {
  let stopped = false;

  function pulse() {
    if (stopped) return;
    onPulse?.({
      active: true,
      listening: Boolean(voiceCore?.listening),
      speaking: Boolean(voiceCore?.speaking),
      timestamp: new Date().toISOString()
    });

    if (voiceCore && !voiceCore.listening && !voiceCore.speaking) {
      try { voiceCore.startListening(); } catch {}
    }

    setTimeout(pulse, intervalMs);
  }

  pulse();

  return {
    stop() {
      stopped = true;
    }
  };
}
