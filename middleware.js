
import { NextResponse } from "next/server";

const suspiciousPatterns = [
  /<script|javascript:/i,
  /union\s+select|drop\s+table|--/i,
  /\.\.\//,
  /ignore previous instructions|reveal system prompt/i
];

function isSuspicious(req) {
  const url = req.nextUrl?.href || "";
  const ua = req.headers.get("user-agent") || "";
  return suspiciousPatterns.some((pattern) => pattern.test(url) || pattern.test(ua));
}

export function middleware(req) {
  if (isSuspicious(req)) {
    return NextResponse.json(
      {
        ok: false,
        shield: "GeniusShield",
        blocked: true,
        message: "GeniusShield blocked this request for safety."
      },
      { status: 403 }
    );
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(self), geolocation=(self)");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; media-src 'self' blob:; connect-src 'self' https://api.openai.com https://*.supabase.co https://maps.googleapis.com https://serpapi.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';"
  );

  return response;
}

export const config = {
  matcher: "/:path*",
};
