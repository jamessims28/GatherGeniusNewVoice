
import { NextResponse } from "next/server";
import { updateApprovalStatus } from "../../../../../lib/phase7/approvalControlCenter";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));

  if (!body.approvalId) {
    return NextResponse.json({ ok: false, message: "approvalId is required." }, { status: 400 });
  }

  const result = await updateApprovalStatus({
    approvalId: body.approvalId,
    userKey: body.userKey || "anonymous_preview",
    actorRole: body.role || "admin",
    status: body.status || "approved",
    reason: body.reason || ""
  });

  return NextResponse.json({ ok: true, approval: result });
}
