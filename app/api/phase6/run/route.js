
import { NextResponse } from "next/server";
import { runProductionAutonomyCore } from "../../../../lib/phase6/productionAutonomyCore";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Genius needs a request first." }, { status: 400 });
  }

  const result = await runProductionAutonomyCore({
    request,
    userKey: body.userKey,
    email: body.email,
    displayName: body.displayName,
    location: body.location || "Virginia",
    permissions: body.permissions || {}
  });

  return NextResponse.json(result);
}
