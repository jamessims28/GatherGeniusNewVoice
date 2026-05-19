
import { NextResponse } from "next/server";
import { gatherMultipleSources, buildGroundedResponsePrompt } from "../../../../lib/intelligence/multiSourceEngine";

export async function POST(req) {
  const body = await req.json();
  const query = body.query || body.text || body.input || "";
  const userKey = body.userKey || "anonymous_preview";
  const permissions = body.permissions || {};

  if (!query) {
    return NextResponse.json({ ok: false, message: "Ask GeniusGather a question first." }, { status: 400 });
  }

  const sourceBundle = await gatherMultipleSources({ query, userKey, permissions });

  let answer = `I gathered ${sourceBundle.sourceCount} available source group(s): ${sourceBundle.availableSources.join(", ") || "none"}.`;

  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = buildGroundedResponsePrompt({ query, sourceBundle });
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          instructions: "You are GeniusGather. Answer using multiple gathered sources. Be concise, practical, and honest about unavailable sources.",
          input: prompt
        })
      });

      const data = await response.json();
      answer = data?.output_text || data?.output?.[0]?.content?.[0]?.text || answer;
    } catch (error) {
      answer += " AI synthesis was unavailable, but sources were gathered.";
    }
  }

  return NextResponse.json({
    ok: true,
    answer,
    sourceBundle
  });
}
