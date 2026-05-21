
export async function streamOperatingCoreTokens({ text = "", readiness = {}, onToken, onDone, onError } = {}) {
  try {
    const response = await fetch("/api/operating-core/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, readiness })
    });

    if (!response.body) {
      const data = await response.json();
      onToken?.(data.response || "");
      onDone?.(data);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      full += chunk;
      onToken?.(chunk);
    }

    onDone?.({ response: full });
  } catch (error) {
    onError?.(error);
  }
}
