
import { NextResponse } from "next/server";
import { runLiveWorldStateSynchronization } from "../../../../lib/phase8/liveWorldStateSynchronization";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const result = await runLiveWorldStateSynchronization({
    location: body.location || "Virginia",
    request: body.request || ""
  });
  return NextResponse.json({ ok: true, world: result });
}
