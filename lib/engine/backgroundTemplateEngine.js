import { eventTypes, styleVibes } from "../accessibility/templates";

export function enrichPromptWithBackgroundTemplates(prompt = "") {
  const text = String(prompt).toLowerCase();

  const matchedEvent =
    eventTypes.find((item) => text.includes(item.prompt) || text.includes(item.id)) ||
    eventTypes.find((item) => text.includes(item.label.toLowerCase())) ||
    eventTypes[0];

  const matchedVibe =
    styleVibes.find((item) => text.includes(item.prompt) || text.includes(item.id)) ||
    styleVibes.find((item) => text.includes(item.label.toLowerCase())) ||
    styleVibes[0];

  return {
    prompt,
    templateSource: "background",
    eventTemplate: matchedEvent,
    vibeTemplate: matchedVibe,
    providerCategories: ["Venue", "Catering", "DJ", "Rentals", "Lighting"],
    hiddenTemplateNote: "Templates are used silently to populate the experience plan."
  };
}
