
import { coreDictionaryLexicon, scoreLexicon } from "./dictionaryLexicon";

const bannedImitationTargets = [
  "celebrity",
  "famous person",
  "private person",
  "coworker",
  "boss",
  "family member",
  "everyone",
  "all people"
];

export function validateConversationTrainingSource(source = {}) {
  const license = source.license || "unknown";
  const consent = Boolean(source.consent);
  const isPublic = Boolean(source.publicDomain || source.openLicensed);
  const isUserProvided = Boolean(source.userProvided);
  const target = String(source.target || "").toLowerCase();

  const unsafeTarget = bannedImitationTargets.some((item) => target.includes(item));

  return {
    ok: (consent || isPublic || isUserProvided) && !unsafeTarget,
    license,
    consent,
    isPublic,
    isUserProvided,
    unsafeTarget,
    reason:
      unsafeTarget ? "Cannot mimic private people, celebrities, or everyone’s conversations." :
      (consent || isPublic || isUserProvided) ? "Source allowed." :
      "Need consent, user-provided examples, or open/public license."
  };
}

export function buildConversationStyleProfile({ text = "", examples = [] } = {}) {
  const lexicon = scoreLexicon(text);
  const allowedExamples = examples.filter((example) => validateConversationTrainingSource(example).ok);

  const style = {
    tone: lexicon.primaryTone,
    emotionalNeed: lexicon.emotionalNeed,
    pacing: lexicon.scores.urgency ? "fast_clear" : lexicon.scores.reassurance ? "slow_reassuring" : "balanced",
    responseShape:
      lexicon.scores.concise ? "short_acknowledge_then_action" :
      lexicon.scores.formal ? "professional_acknowledge_reason_action" :
      "warm_acknowledge_reflect_action_question",
    learnedFromApprovedExamples: allowedExamples.length
  };

  return {
    layer: "consent_conversation_style_engine",
    safe: true,
    note: "This engine does not download or mimic private conversations. It only uses approved, public, or user-provided examples.",
    lexicon,
    style,
    allowedExamples
  };
}

export function composeSafeHumanResponse({ text = "", coreResponse = "", examples = [] } = {}) {
  const profile = buildConversationStyleProfile({ text, examples });
  const primitives = coreDictionaryLexicon.responsePrimitives;

  const acknowledge =
    profile.style.emotionalNeed === "reassurance" ? "I hear you, and I’ll keep this calm." :
    profile.style.tone === "formal" ? "I understand." :
    profile.style.tone === "premium" ? "I understand the premium direction." :
    primitives.acknowledge[0];

  const protection =
    profile.lexicon.scores.trust ? "I’ll protect the outcome and confirm the safest path." :
    profile.lexicon.scores.urgency ? "I’ll move quickly but still protect the important details." :
    "I’ll guide the next safe step.";

  const question =
    profile.style.responseShape === "short_acknowledge_then_action"
      ? ""
      : "What matters most right now: timing, quality, budget, or safety?";

  return {
    layer: "safe_human_response_composer",
    response: [acknowledge, coreResponse || protection, question].filter(Boolean).join(" "),
    styleProfile: profile
  };
}
