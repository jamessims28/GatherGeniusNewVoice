
const forbiddenPatterns = [
  /child_process/i,
  /execSync/i,
  /spawn\(/i,
  /eval\(/i,
  /new Function/i,
  /process\.env\.[A-Z0-9_]+/i,
  /rm\s+-rf/i,
  /curl\s+/i,
  /wget\s+/i,
  /fs\.writeFileSync/i
];

export function validateGeneratedCode(code = "") {
  const hits = forbiddenPatterns
    .filter((pattern) => pattern.test(code))
    .map((pattern) => pattern.toString());

  return {
    safe: hits.length === 0,
    hits,
    message: hits.length
      ? "Generated code contained unsafe patterns and was blocked."
      : "Generated code passed safety scan."
  };
}

export function sanitizeCodeRequest(input = "") {
  return String(input)
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .slice(0, 3000)
    .trim();
}
