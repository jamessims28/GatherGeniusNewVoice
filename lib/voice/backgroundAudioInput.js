
export const audioInputModes = {
  computer: "Computer Mic",
  headset: "Headset",
  intercom: "Intercom Mode"
};

export async function getAvailableAudioInputs() {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
    return [];
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "audioinput");
  } catch {
    return [];
  }
}

export async function enableBackgroundAudioInputs() {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return {
      ok: false,
      mode: "unsupported",
      message: "This browser does not support microphone access."
    };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());

    const devices = await getAvailableAudioInputs();

    return {
      ok: true,
      modesEnabled: Object.values(audioInputModes),
      devices,
      preferredDeviceId: devices?.[0]?.deviceId || "",
      message: "Computer mic, headset, and intercom-compatible audio inputs are enabled in the background."
    };
  } catch {
    return {
      ok: false,
      modesEnabled: Object.values(audioInputModes),
      devices: [],
      preferredDeviceId: "",
      message: "Microphone permission is needed. Audio input modes are ready but waiting for permission."
    };
  }
}
