
export class RealtimeAudioPipeline {
  constructor({ onEvent, onTranscript, onAudioState, onError } = {}) {
    this.peer = null;
    this.channel = null;
    this.stream = null;
    this.audioElement = null;
    this.onEvent = onEvent;
    this.onTranscript = onTranscript;
    this.onAudioState = onAudioState;
    this.onError = onError;
    this.connected = false;
  }

  async connect({ sessionEndpoint = "/api/realtime/session" } = {}) {
    try {
      const sessionRes = await fetch(sessionEndpoint, { method: "POST" });
      const sessionData = await sessionRes.json();

      if (!sessionData.ok) {
        throw new Error(sessionData.message || "Realtime session unavailable.");
      }

      const clientSecret =
        sessionData.session?.client_secret?.value ||
        sessionData.session?.client_secret ||
        sessionData.session?.ephemeral_key ||
        "";

      if (!clientSecret) {
        throw new Error("Realtime client secret missing.");
      }

      this.peer = new RTCPeerConnection();

      this.audioElement = document.createElement("audio");
      this.audioElement.autoplay = true;
      this.audioElement.style.display = "none";
      document.body.appendChild(this.audioElement);

      this.peer.ontrack = (event) => {
        this.audioElement.srcObject = event.streams[0];
        this.onAudioState?.("receiving_audio");
      };

      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.stream.getTracks().forEach((track) => this.peer.addTrack(track, this.stream));

      this.channel = this.peer.createDataChannel("oai-events");
      this.channel.onopen = () => {
        this.connected = true;
        this.onEvent?.({ type: "realtime.connected" });
      };

      this.channel.onmessage = (event) => {
        let parsed = null;
        try { parsed = JSON.parse(event.data); } catch { parsed = { type: "raw", data: event.data }; }
        this.handleRealtimeEvent(parsed);
      };

      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);

      const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clientSecret}`,
          "Content-Type": "application/sdp"
        },
        body: offer.sdp
      });

      const answerSdp = await sdpResponse.text();

      if (!sdpResponse.ok) {
        throw new Error(answerSdp || "Realtime SDP exchange failed.");
      }

      await this.peer.setRemoteDescription({ type: "answer", sdp: answerSdp });

      return { ok: true };
    } catch (error) {
      this.onError?.(error);
      return { ok: false, message: error.message };
    }
  }

  handleRealtimeEvent(event) {
    this.onEvent?.(event);

    if (
      event.type === "response.audio_transcript.delta" ||
      event.type === "response.output_text.delta" ||
      event.type === "conversation.item.input_audio_transcription.completed"
    ) {
      this.onTranscript?.(event);
    }
  }

  sendEvent(event) {
    if (!this.channel || this.channel.readyState !== "open") return false;
    this.channel.send(JSON.stringify(event));
    return true;
  }

  interrupt() {
    this.sendEvent({ type: "response.cancel" });
    this.onAudioState?.("interrupted");
  }

  requestResponse({ instructions = "" } = {}) {
    this.sendEvent({
      type: "response.create",
      response: {
        modalities: ["audio", "text"],
        instructions
      }
    });
  }

  close() {
    try { this.interrupt(); } catch {}
    try { this.channel?.close(); } catch {}
    try { this.peer?.close(); } catch {}
    try { this.stream?.getTracks()?.forEach((track) => track.stop()); } catch {}
    try { this.audioElement?.remove(); } catch {}
    this.connected = false;
  }
}
