
import { runAutonomousOperationsCommandCore } from "../phase17/autonomousOperationsCommandCore";
import { runAdaptiveMemoryReviewEngine } from "./adaptiveMemoryReviewEngine";
import { runPrivacyBoundaryEngine } from "./privacyBoundaryEngine";
import { runSecurityRiskScoringEngine } from "./securityRiskScoringEngine";
import { runBackgroundGovernanceRuntime } from "./backgroundGovernanceRuntime";

export async function runAdaptiveMemorySecurityCore({
  request = "",
  tenantId = "default",
  userKey = "anonymous_preview",
  role = "admin",
  memory = {},
  permissions = {},
  metrics = {}
} = {}) {
  const operations = await runAutonomousOperationsCommandCore({
    request,
    tenantId,
    userKey,
    role,
    memory,
    permissions,
    metrics
  });

  const memoryReview = runAdaptiveMemoryReviewEngine({
    request,
    memory,
    userKey
  });

  const privacy = runPrivacyBoundaryEngine({
    request,
    action: { external: false },
    tenant: operations.reliabilityCore?.enterprise?.tenant || { tenantId }
  });

  const security = runSecurityRiskScoringEngine({
    privacy,
    memoryReview,
    operations,
    request
  });

  const governance = runBackgroundGovernanceRuntime({
    memoryReview,
    privacy,
    security
  });

  return {
    ok: true,
    layer: "adaptive_memory_security_core",
    name: "GatherGenius Adaptive Memory & Security Core",
    backgroundOnly: true,
    operations,
    memoryReview,
    privacy,
    security,
    governance,
    response: buildResponse({ memoryReview, privacy, security, governance }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ memoryReview, privacy, security, governance }) {
  if (security.riskLevel === "high") {
    return "Background intelligence is active, but a high security risk requires review before execution.";
  }

  if (privacy.requiresConsent) {
    return "Background intelligence is active. Privacy-sensitive items are held for consent.";
  }

  if (memoryReview.candidateMemories?.length) {
    return `${memoryReview.candidateMemories.length} memory update(s) prepared for review while Genius stays in the background.`;
  }

  return governance.message || "Adaptive memory and security intelligence is running quietly in the background.";
}
