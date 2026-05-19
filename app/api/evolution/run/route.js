import { NextResponse } from "next/server";
import { runEvolutionStack } from "../../../../lib/evolution/evolutionOrchestrator";

export async function POST(req) {
  const body = await req.json();
  const result = runEvolutionStack(body || {});
  return NextResponse.json(result);
}
