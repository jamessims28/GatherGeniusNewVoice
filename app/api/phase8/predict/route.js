
import { NextResponse } from "next/server";
import { runRealityPredictionEngine } from "../../../../lib/phase8/realityPredictionEngine";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const result = runRealityPredictionEngine({
    world: body.world || {},
    relationship: body.relationship || {},
    graph: body.graph || {}
  });
  return NextResponse.json({ ok: true, predictions: result });
}
