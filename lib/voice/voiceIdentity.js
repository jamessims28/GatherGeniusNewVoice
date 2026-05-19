export const gatherGeniusWakeNames = [
  "GatherGenius",
  "G",
  "GG",
  "Genius",
  "Gather"
];

export const preferredVoiceName = "GeniusGather";

export function detectWakeName(input = "") {
  const text = String(input).trim().toLowerCase();

  const aliases = [
    { spoken: "gathergenius", display: "GatherGenius" },
    { spoken: "gather genius", display: "GatherGenius" },
    { spoken: "gg", display: "GG" },
    { spoken: "g g", display: "GG" },
    { spoken: "genius", display: "Genius" },
    { spoken: "gather", display: "Gather" },
    { spoken: "g", display: "G" }
  ];

  return aliases.find((alias) => {
    if (alias.spoken.length === 1) {
      return text === alias.spoken || text.startsWith(alias.spoken + " ");
    }
    return text.includes(alias.spoken);
  }) || null;
}

export function buildVoiceIntro() {
  return "Hi, I’m GeniusGather. I’m here to help you create the right experience calmly and clearly. You can also call me GatherGenius, G, GG, Genius, or Gather.";
}

export function buildVoiceResponseForName(input = "") {
  const detected = detectWakeName(input);

  if (!detected) {
    return {
      wakeNameDetected: false,
      preferredName: preferredVoiceName,
      response: buildVoiceIntro()
    };
  }

  return {
    wakeNameDetected: true,
    heardName: detected.display,
    preferredName: preferredVoiceName,
    response: `Yes — I heard ${detected.display}. My preferred name is GeniusGather, but you can also call me G, GG, Genius, or Gather. I’m ready to ask the right questions and build the best result for you.`
  };
}
