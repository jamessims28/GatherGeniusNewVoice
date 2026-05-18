import { NextResponse } from "next/server";
import { analyzeThreat, buildShieldResponse } from "../../../../lib/security/geniusShield";
import { buildConversationSystemPrompt } from "../../../../lib/conversation/personality";
import { analyzeComfortState, buildFriendResponseInstruction } from "../../../../lib/voice/comfortToneEngine";
import { runLocalConversationAction } from "../../../../lib/conversation/actionRouter";
import { summarizeApprovedContext } from "../../../../lib/conversation/memory";
import { gatherMultipleSources, buildGroundedResponsePrompt } from "../../../../lib/intelligence/multiSourceEngine";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json();
  const text = body.text || "";
  const threat = analyzeThreat({ text, path: "/api/conversation/respond", method: "POST", userAgent: req.headers.get("user-agent") || "", ip: req.headers.get("x-forwarded-for") || "unknown" });
  if (threat.blocked) {
    const supabaseThreat = getSupabaseAdmin();
    if (supabaseThreat) {
      await supabaseThreat.from("security_incidents").insert({
        shield_version: threat.shieldVersion,
        severity: threat.severity,
        blocked: true,
        threat_ids: threat.threatIds,
        evidence: threat.evidence,
        response_message: threat.responseMessage
      }).catch(() => null);
    }
    return NextResponse.json(buildShieldResponse(threat), { status: 403 });
  }
  const userKey = body.userKey || "anonymous_preview";
  const permissions = body.permissions || {};
  const currentLock = body.currentLock || null;

  const comfort = analyzeComfortState(text, body.history || []);

  const approvedContext = summarizeApprovedContext({
    permissions,
    memories: body.memories || []
  });

  const localAction = runLocalConversationAction({ text, currentLock });
  const sourceBundle = await gatherMultipleSources({ query: text, userKey, permissions }).catch(() => null);
  const systemPrompt = buildConversationSystemPrompt({ approvedContext, currentState: localAction.action }) + buildFriendResponseInstruction(comfort);

  let responseText = localAction.message;
  if (sourceBundle?.sourceCount) {
    responseText += ` I checked ${sourceBundle.sourceCount} source group(s): ${sourceBundle.availableSources.join(", ")}.`;
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const aiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          instructions: systemPrompt,
          input: buildGroundedResponsePrompt({ query: text, sourceBundle: sourceBundle || { sources: [] } }) + `\nDetected action: ${localAction.action}\nLocal action result: ${localAction.message}\nRespond naturally and briefly.`
        })
      });

      const aiData = await aiResponse.json();
      responseText =
        aiData?.output_text ||
        aiData?.output?.[0]?.content?.[0]?.text ||
        responseText;
    } catch {}
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("conversation_memory").insert({
      user_key: userKey,
      role: "user",
      content: text,
      action: localAction.action,
      metadata: { permissions, currentLock }
    }).catch(() => null);

    await supabase.from("conversation_memory").insert({
      user_key: userKey,
      role: "assistant",
      content: responseText,
      action: localAction.action,
      metadata: { localAction }
    }).catch(() => null);
  }

  return NextResponse.json({
    ok: true,
    action: localAction.action,
    response: responseText,
    localAction,
    comfort
  });
}
