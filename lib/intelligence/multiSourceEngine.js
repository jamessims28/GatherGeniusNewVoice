
import {
  getConversationMemorySource,
  getExperienceHistorySource,
  getPricingSource,
  getProviderSource,
  getWebSearchSource
} from "./sourceConnectors";

function shouldUsePricing(query = "") {
  const text = String(query).toLowerCase();
  return ["price", "cost", "quote", "budget", "how much", "pricing", "estimate"].some((term) => text.includes(term));
}

function shouldUseExternalSearch(query = "") {
  const text = String(query).toLowerCase();
  return ["latest", "current", "near me", "find", "source", "real", "live", "today"].some((term) => text.includes(term));
}

export async function gatherMultipleSources({ query = "", userKey = "anonymous_preview", permissions = {} } = {}) {
  const tasks = [
    getConversationMemorySource({ userKey }),
    getExperienceHistorySource({ userKey }),
    getProviderSource({})
  ];

  if (shouldUsePricing(query)) tasks.push(getPricingSource({ query }));
  if (shouldUseExternalSearch(query)) tasks.push(getWebSearchSource({ query }));

  const sources = await Promise.all(tasks.map((task) => task.catch((error) => ({
    id: "unknown",
    name: "Unknown Source",
    available: false,
    items: [],
    note: error.message
  }))));

  const available = sources.filter((source) => source.available);
  const unavailable = sources.filter((source) => !source.available);

  return {
    ok: true,
    query,
    sources,
    availableSources: available.map((source) => source.name),
    unavailableSources: unavailable.map((source) => ({ name: source.name, note: source.note })),
    sourceCount: available.length,
    summary: buildSourceSummary(sources)
  };
}

export function buildSourceSummary(sources = []) {
  return sources.map((source) => {
    const count = Array.isArray(source.items) ? source.items.length : 0;
    return `${source.name}: ${source.available ? "available" : "not available"} (${count} items). ${source.note || ""}`;
  }).join("\\n");
}

export function buildGroundedResponsePrompt({ query = "", sourceBundle }) {
  const sourceText = sourceBundle.sources.map((source) => {
    const sample = JSON.stringify((source.items || []).slice(0, 3), null, 2).slice(0, 3000);
    return `SOURCE: ${source.name}\\nAVAILABLE: ${source.available}\\nNOTE: ${source.note}\\nDATA SAMPLE:\\n${sample}`;
  }).join("\\n\\n");

  return `
User request:
${query}

Use the following sources to answer. Be honest if a source is unavailable.
Do not pretend live data exists when it does not.
Give a practical result and mention what was used.

${sourceText}
`;
}
