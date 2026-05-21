
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const protectedTypes = ["payment", "booking", "external_message", "contract", "legal", "calendar_invite"];
  const type = body.type || "internal";
  return NextResponse.json({
    ok: true,
    type,
    requiresConfirmation: protectedTypes.includes(type),
    message: protectedTypes.includes(type) ? "Confirmation required." : "Safe to prepare."
  });
}
