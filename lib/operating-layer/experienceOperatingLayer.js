
import { runAutonomousHumanCore } from "../human-intelligence/autonomousHumanCore";
import { gatherRealWorldSignals } from "../realworld/realWorldSignalEngine";

export async function runExperienceOperatingLayer({ request = "", userKey = "anonymous_preview", currentLock = null } = {}) {
  const location =
    currentLock?.intent?.location ||
    extractLocation(request) ||
    "Virginia";

  const category =
    currentLock?.intent?.eventType ||
    extractCategory(request) ||
    "general";

  const humanCore = runAutonomousHumanCore({
    text: request,
    intent: currentLock?.intent || { category, location },
    currentLock
  });

  const realWorld = await gatherRealWorldSignals({
    request,
    location,
    category
  });

  const operations = buildOperations({ humanCore, realWorld });

  return {
    ok: true,
    layer: "ai_experience_operating_layer",
    request,
    userKey,
    humanCore,
    realWorld,
    operations,
    finalDecision: buildFinalDecision({ humanCore, realWorld, operations }),
    generatedAt: new Date().toISOString()
  };
}

function extractLocation(text = "") {
  const match =
    String(text).match(/in\s+([a-zA-Z ,]+)$/) ||
    String(text).match(/near\s+([a-zA-Z ,]+)$/) ||
    String(text).match(/around\s+([a-zA-Z ,]+)$/);

  return match?.[1]?.trim();
}

function extractCategory(text = "") {
  const lower = String(text).toLowerCase();
  if (lower.includes("wedding")) return "wedding";
  if (lower.includes("bbq") || lower.includes("barbecue")) return "bbq";
  if (lower.includes("birthday")) return "birthday";
  if (lower.includes("corporate")) return "corporate";
  if (lower.includes("travel")) return "travel";
  return "experience";
}

function buildOperations({ humanCore, realWorld }) {
  const actions = [];

  actions.push({
    id: "understand_human",
    status: "complete",
    label: humanCore.humanProfile.summary
  });

  actions.push({
    id: "read_real_world",
    status: "complete",
    label: `Signals checked: ${realWorld.sourceList.join(", ")}`
  });

  if (realWorld.signals.weather.riskLevel === "high") {
    actions.push({
      id: "weather_protection",
      status: "active",
      label: "Prepare indoor or backup plan."
    });
  }

  if (realWorld.signals.pricing?.pricing?.mode === "fallback-estimate") {
    actions.push({
      id: "price_confirmation",
      status: "needed",
      label: "Confirm live provider quote before final lock."
    });
  }

  if (humanCore.problemPrediction.severity !== "low") {
    actions.push({
      id: "risk_prevention",
      status: "active",
      label: humanCore.problemPrediction.recommendedPrevention.join(", ")
    });
  }

  actions.push({
    id: "outcome_path",
    status: "ready",
    label: realWorld.nextRealWorldMove
  });

  return {
    objective: "coordinate real-world outcome",
    actions,
    canExecuteAutomatically: actions.every((action) => action.status !== "needed"),
    confidence: computeConfidence({ humanCore, realWorld, actions })
  };
}

function computeConfidence({ humanCore, realWorld, actions }) {
  let score = 94;

  if (humanCore.problemPrediction.severity === "medium") score -= 8;
  if (humanCore.problemPrediction.severity === "high") score -= 18;
  if (realWorld.signals.weather.riskLevel === "medium") score -= 6;
  if (realWorld.signals.weather.riskLevel === "high") score -= 14;
  if (realWorld.signals.pricing?.pricing?.mode === "fallback-estimate") score -= 5;
  if (actions.some((action) => action.status === "needed")) score -= 6;

  return Math.max(40, Math.min(99, score));
}

function buildFinalDecision({ humanCore, realWorld, operations }) {
  return {
    recommendation:
      operations.canExecuteAutomatically
        ? "Proceed with the protected recommendation."
        : "Pause for confirmation before final execution.",
    userMessage:
      operations.canExecuteAutomatically
        ? "I checked the real-world signals and can move this forward safely."
        : "I checked the real-world signals. One item needs confirmation before I move forward.",
    nextAction:
      operations.canExecuteAutomatically
        ? "execute_next_step"
        : "request_confirmation",
    confidence: operations.confidence,
    reason: realWorld.constraints.length
      ? realWorld.constraints.join(" ")
      : "No major blockers detected."
  };
}
