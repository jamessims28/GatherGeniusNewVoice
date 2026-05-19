"use client";

import { useEffect, useState } from "react";

export default function VoiceInputDevicePanel({ onDeviceChange, onModeChange, background = true }) {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [mode, setMode] = useState("computer");
  const [status, setStatus] = useState("Choose a voice input. Your computer microphone usually works.");

  async function loadDevices() {
    try {
      setStatus("Requesting microphone permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices.filter((device) => device.kind === "audioinput");
      setDevices(audioInputs);

      if (audioInputs[0] && !selectedDeviceId) {
        setSelectedDeviceId(audioInputs[0].deviceId);
        onDeviceChange?.(audioInputs[0].deviceId);
      }

      setStatus(audioInputs.length ? "Voice input ready." : "No microphone found. Connect a mic or intercom device.");
    } catch (error) {
      setStatus("Microphone permission is needed for voice interaction.");
    }
  }

  useEffect(() => {
    if (navigator.mediaDevices?.enumerateDevices) {
      loadDevices();
    } else {
      setStatus("This browser does not support microphone device selection.");
    }
  }, []);

  function changeMode(nextMode) {
    setMode(nextMode);
    onModeChange?.(nextMode);
  }

  function changeDevice(deviceId) {
    setSelectedDeviceId(deviceId);
    onDeviceChange?.(deviceId);
  }

  if (background) {
    return (
      <div className="gg-audio-background-status" aria-live="polite">
        <span>Audio inputs active in background</span>
      </div>
    );
  }

  return (
    <div className="gg-device-panel">
      <span className="gg-status good">Voice Input</span>
      <p className="gg-note">{status}</p>

      <div className="gg-device-actions">
        <button type="button" className={`gg-device-chip ${mode === "computer" ? "active" : ""}`} onClick={() => changeMode("computer")}>
          Computer Mic
        </button>
        <button type="button" className={`gg-device-chip ${mode === "headset" ? "active" : ""}`} onClick={() => changeMode("headset")}>
          Headset
        </button>
        <button type="button" className={`gg-device-chip ${mode === "intercom" ? "active" : ""}`} onClick={() => changeMode("intercom")}>
          Intercom Mode
        </button>
      </div>

      <select value={selectedDeviceId} onChange={(event) => changeDevice(event.target.value)}>
        {devices.length === 0 && <option value="">No audio input detected</option>}
        {devices.map((device, index) => (
          <option key={device.deviceId || index} value={device.deviceId}>
            {device.label || `Microphone ${index + 1}`}
          </option>
        ))}
      </select>

      <button type="button" className="gg-btn secondary" onClick={loadDevices}>
        REFRESH AUDIO INPUTS
      </button>
    </div>
  );
}
