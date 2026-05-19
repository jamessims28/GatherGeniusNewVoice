
export function summarizeApprovedContext({ permissions = {}, memories = [] } = {}) {
  const approved = Object.entries(permissions || {})
    .filter(([, value]) => value)
    .map(([key]) => key.replaceAll("_", " "));

  const memorySummary = Array.isArray(memories) && memories.length
    ? memories.slice(-5).map((item) => `- ${typeof item === "string" ? item : item.content || JSON.stringify(item)}`).join("\n")
    : "No prior memory available.";

  return `
Approved data sources:
${approved.length ? approved.join(", ") : "None"}

Recent memory:
${memorySummary}
`;
}
