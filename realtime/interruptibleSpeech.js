
export function createInterruptController() {
  let speaking = false;
  let interrupted = false;

  return {
    get speaking() { return speaking; },
    get interrupted() { return interrupted; },

    start() {
      speaking = true;
      interrupted = false;
    },

    interrupt({ pipeline } = {}) {
      interrupted = true;
      speaking = false;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      pipeline?.interrupt?.();
      return { interrupted: true, action: "cancel_current_speech_and_listen" };
    },

    finish() {
      speaking = false;
    }
  };
}
