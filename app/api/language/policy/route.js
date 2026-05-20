
import { NextResponse } from "next/server";
import { getConversationSourcePolicy } from "../../../../lib/language/publicConversationSources";

export async function GET() {
  return NextResponse.json(getConversationSourcePolicy());
}
