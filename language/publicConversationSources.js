
export const approvedPublicConversationSourcePatterns = [
  {
    name: "User-provided examples",
    allowed: true,
    requirement: "The user must provide or own the examples."
  },
  {
    name: "Public-domain dialogue",
    allowed: true,
    requirement: "Must be public domain or open licensed."
  },
  {
    name: "Open-licensed support transcripts",
    allowed: true,
    requirement: "Must be licensed for reuse and not contain private personal data."
  },
  {
    name: "Private conversations from other people",
    allowed: false,
    requirement: "Not allowed without consent."
  },
  {
    name: "Mimic a specific living person",
    allowed: false,
    requirement: "Do not impersonate or closely mimic an identifiable person."
  }
];

export function getConversationSourcePolicy() {
  return {
    layer: "conversation_source_policy",
    allowed: approvedPublicConversationSourcePatterns.filter((item) => item.allowed),
    blocked: approvedPublicConversationSourcePatterns.filter((item) => !item.allowed),
    summary: "GatherGenius can learn from approved, user-provided, public-domain, or open-licensed examples, but it cannot download or mimic private conversations from everyone."
  };
}
