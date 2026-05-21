
import { createRealtimeSessionState, reduceRealtimeEvent, buildRealtimeSystemPrompt } from "../phase1/realtimeStabilityCore";
import { analyzeHumanState, adaptResponseToHuman } from "../phase2/humanIntelligenceLayer";
import { runWorldOperatingLayer } from "../phase3/worldOperatingLayer";
import { runGatherGeniusOperatingCore } from "../operating-core/gatherGeniusOperatingCore";

export async function runPhase123OperatingUpgrade({
  text = "",
  readiness = { ready: true },
  location = "Virginia",
  history = [],
  memory = {}
} = {}) {
  let realtime = createRealtimeSessionState();
  realtime = reduceRealtimeEvent(realtime, { type: readiness.ready ? "connected" : "fallback" });

  const human = analyzeHumanState({ text, history });
  const world = await runWorldOperatingLayer({ text, location });

  const baseCore = await runGatherGeniusOperatingCore({
    text,
    readiness,
    location
  });

  const adapted = adaptResponseToHuman({
    response: baseCore.response,
    human
  });

  const prompt = buildRealtimeSystemPrompt({ human, world, memory });

  return {
    ok: true,
    layer: "phase_1_2_3_operating_upgrade",
    phases: {
      phase1RealtimeStability: realtime,
      phase2HumanIntelligence: human,
      phase3WorldOperatingLayer: world
    },
    baseCore,
    realtimeSystemPrompt: prompt,
    response: adapted,
    decision: {
      speak: true,
      nextAction:
        !readiness.ready ? "enable_voice" :
        world.riskLevel === "elevated" ? "protect_world_risk" :
        human.decisionFatigue ? "reduce_choices" :
        "continue_next_safe_step",
      confidence: Math.min(0.96, (baseCore.decision?.confidence || 0.82) + 0.04)
    },
    createdAt: new Date().toISOString()
  };
}
