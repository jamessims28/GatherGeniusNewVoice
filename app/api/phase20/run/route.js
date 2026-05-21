
import { NextResponse } from "next/server";
import { runRealIntegrationsDeploymentCore } from "../../../../lib/phase20/realIntegrationsDeploymentCore";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Request is required." }, { status: 400 });
  }

  const result = await runRealIntegrationsDeploymentCore({
    request,
    tenantId: body.tenantId || "default",
    userKey: body.userKey || "anonymous_preview",
    role: body.role || "admin",
    memory: body.memory || {},
    permissions: body.permissions || {},
    metrics: body.metrics || {}
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("gg_real_integration_deployment_runs").insert({
      tenant_id: body.tenantId || "default",
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      security: result.security,
      integrations: result.integrations,
      deployment: result.deployment,
      connectors: result.connectors,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
