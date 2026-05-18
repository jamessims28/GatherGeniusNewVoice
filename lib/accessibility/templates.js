export const eventTypes = [
  { id: "wedding", label: "Wedding", icon: "💍", prompt: "wedding" },
  { id: "birthday", label: "Birthday", icon: "🎂", prompt: "birthday celebration" },
  { id: "graduation", label: "Graduation", icon: "🎓", prompt: "graduation celebration" },
  { id: "corporate", label: "Corporate Experience", icon: "🏢", prompt: "corporate experience" },
  { id: "bbq", label: "BBQ", icon: "🔥", prompt: "backyard BBQ" },
  { id: "music", label: "Live Experience", icon: "🎵", prompt: "live music experience" }
];

export const styleVibes = [
  { id: "luxury", label: "Luxury", icon: "✨", prompt: "luxury" },
  { id: "simple", label: "Simple", icon: "○", prompt: "simple" },
  { id: "outdoor", label: "Outdoor", icon: "🌿", prompt: "outdoor" },
  { id: "modern", label: "Modern", icon: "◇", prompt: "modern" },
  { id: "family", label: "Family", icon: "🤍", prompt: "family-friendly" },
  { id: "formal", label: "Formal", icon: "◆", prompt: "formal" }
];

export function findEventType(id) {
  return eventTypes.find((item) => item.id === id) || eventTypes[0];
}

export function findVibe(id) {
  return styleVibes.find((item) => item.id === id) || styleVibes[0];
}
