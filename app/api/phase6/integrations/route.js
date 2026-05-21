
import { NextResponse } from "next/server";
import { getIntegrationRegistry, summarizeIntegrations } from "../../../../lib/phase6/integrationRegistry";

export async function GET() {
  const registry = getIntegrationRegistry();
  return NextResponse.json({
    ok: true,
    registry,
    summary: summarizeIntegrations(registry)
  });
}
