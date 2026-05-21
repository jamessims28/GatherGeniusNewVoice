
export function buildRelationshipMemory({ conversation = [], existing = {} } = {}) {
  const text = conversation.map((item) => item.text || "").join(" ").toLowerCase();

  const relationships = {
    family: /family|cousin|aunt|uncle|mother|father|kids|children/.test(text),
    business: /client|investor|vendor|team|company|business/.test(text),
    trustedCircle: /private|exclusive|trusted|safe|inner circle/.test(text)
  };

  const communicationTrust = {
    prefersPermission: /ask me|confirm|permission|before you/.test(text),
    delegates: /handle it|you decide|go ahead|do it/.test(text),
    proofFirst: /proof|verify|trusted|show me/.test(text)
  };

  return {
    layer: "persistent_relationship_memory",
    ...existing,
    relationships: { ...(existing.relationships || {}), ...relationships },
    communicationTrust: { ...(existing.communicationTrust || {}), ...communicationTrust },
    summary:
      relationships.family ? "family-centered context" :
      relationships.business ? "business-centered context" :
      relationships.trustedCircle ? "private trusted-circle context" :
      "relationship context learning"
  };
}
