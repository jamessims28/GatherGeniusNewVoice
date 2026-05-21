
import { NextResponse } from "next/server";
import { approveAction } from "../../../../lib/phase6/approvalWorkflow";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  if (!body.approvalId) {
    return NextResponse.json({ ok: false, message: "approvalId is required." }, { status: 400 });
  }

  const result = await approveAction({
    approvalId: body.approvalId,
    userKey: body.userKey || "anonymous_preview"
  });

  return NextResponse.json({ ok: true, approval: result });
}
