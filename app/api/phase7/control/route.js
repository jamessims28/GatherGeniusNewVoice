
import { NextResponse } from "next/server";
import { runTrustProductionControlCore } from "../../../../lib/phase7/trustProductionControlCore";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const result = await runTrustProductionControlCore({
    userKey: body.userKey || "anonymous_preview",
    email: body.email || "",
    requestedRole: body.role || "admin",
    request: body.request || "phase7 control access"
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 403 });
}
