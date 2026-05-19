
export function sanitizeInput(input = "") {
  return String(input)
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export function detectSuspiciousActivity(text = "") {
  const patterns = ["drop table","<script","union select","../"];

  return patterns.some((pattern) =>
    String(text).toLowerCase().includes(pattern)
  );
}
