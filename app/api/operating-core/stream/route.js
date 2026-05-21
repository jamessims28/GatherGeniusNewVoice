
import { runGatherGeniusOperatingCore } from "../../../../lib/operating-core/gatherGeniusOperatingCore";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || "";
  const readiness = body.readiness || { ready: true };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await runGatherGeniusOperatingCore({
          text,
          readiness,
          location: body.location || "Virginia"
        });

        const response = result.response || "I understand. I can guide the next safe step.";
        const tokens = response.split(/(\s+)/).filter(Boolean);

        for (const token of tokens) {
          controller.enqueue(encoder.encode(token));
          await new Promise((resolve) => setTimeout(resolve, 18));
        }

        controller.close();
      } catch {
        controller.enqueue(encoder.encode("I had trouble streaming the response."));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no"
    }
  });
}
