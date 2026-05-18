import { NextResponse } from "next/server";
import { permissionCatalog } from "../../../../lib/permissions/permissionCatalog";

export async function POST(req) {
  const body = await req.json();
  const requested = body.permissionId;
  const permission = permissionCatalog.find((item) => item.id === requested);

  if (!permission) {
    return NextResponse.json({
      ok: false,
      message: "GatherGenius could not find that permission type. Please check the permission request."
    }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    permission,
    message: `GatherGenius would like to use ${permission.shortTitle} in the background to improve your experience.`
  });
}
