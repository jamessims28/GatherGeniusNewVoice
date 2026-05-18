
export const supportedLanguages = [
  "en-US","es-ES","fr-FR","de-DE","it-IT","pt-BR","ar-SA",
  "zh-CN","ja-JP","ko-KR","ru-RU","hi-IN"
];

export function detectPreferredLanguage(text = "") {
  if (/[ぁ-んァ-ン]/.test(text)) return "ja-JP";
  if (/[\u4e00-\u9fff]/.test(text)) return "zh-CN";
  if (/[а-яА-Я]/.test(text)) return "ru-RU";
  if (/[ء-ي]/.test(text)) return "ar-SA";
  if (/[가-힣]/.test(text)) return "ko-KR";
  return "en-US";
}

export function buildVoiceSettings(text = "") {
  return {
    language: detectPreferredLanguage(text),
    rate: 0.78,
    pitch: 1.08,
    volume: 0.94
  };
}
