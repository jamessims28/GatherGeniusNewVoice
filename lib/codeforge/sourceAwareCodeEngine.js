
import { gatherMultipleSources, buildGroundedResponsePrompt } from "../intelligence/multiSourceEngine";
import { validateGeneratedCode, sanitizeCodeRequest } from "./codeSafety";

function fallbackGenerate({ request = "", sourceBundle }) {
  const sourceNames = sourceBundle?.availableSources?.join(", ") || "background sources";
  return `// GeniusGather Source-Aware Module
// Request: ${request}
// Sources used: ${sourceNames}
// This fallback module is intentionally simple and safe.

export const sourceAwareFeature = {
  name: "GeniusGatherSourceAwareFeature",
  purpose: ${JSON.stringify(request)},
  sourceStrategy: ${JSON.stringify(sourceNames)},
  run(input = {}) {
    return {
      ok: true,
      message: "GeniusGather processed this through source-aware logic.",
      input,
      sourcesUsed: ${JSON.stringify(sourceBundle?.availableSources || [])}
    };
  }
};
`;
}

export async function generateSourceAwareCode({ request = "", userKey = "anonymous_preview", permissions = {} } = {}) {
  const cleanRequest = sanitizeCodeRequest(request);

  const sourceBundle = await gatherMultipleSources({
    query: cleanRequest,
    userKey,
    permissions
  });

  let generatedCode = fallbackGenerate({ request: cleanRequest, sourceBundle });
  let generationMode = "safe-fallback";

  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = buildGroundedResponsePrompt({ query: cleanRequest, sourceBundle });

      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          instructions: `You are the GeniusGather Source-Aware Code Forge.
Generate original, app-specific, production-minded JavaScript or React code.
Rules:
- Use the gathered sources as requirements and constraints.
- Do not copy boilerplate from public examples.
- Do not include secrets.
- Do not use child_process, eval, shell commands, fs writes, or unsafe code.
- Code must be self-contained and clearly named for GeniusGather.
- Return code only. No markdown fences.`,
          input: `${prompt}

Code request:
${cleanRequest}

Generate a distinct GeniusGather-specific implementation.`
        })
      });

      const data = await response.json();
      const candidate =
        data?.output_text ||
        data?.output?.[0]?.content?.[0]?.text ||
        "";

      if (candidate.trim()) {
        generatedCode = candidate.trim().replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "");
        generationMode = "ai-source-aware";
      }
    } catch {
      generationMode = "safe-fallback-after-ai-error";
    }
  }

  const safety = validateGeneratedCode(generatedCode);

  return {
    ok: safety.safe,
    request: cleanRequest,
    generationMode,
    code: safety.safe ? generatedCode : fallbackGenerate({ request: cleanRequest, sourceBundle }),
    safety,
    sourceBundle,
    note: safety.safe
      ? "Code generated from multiple gathered sources and passed safety scan."
      : "Unsafe generated code was blocked and replaced with a safe fallback."
  };
}
