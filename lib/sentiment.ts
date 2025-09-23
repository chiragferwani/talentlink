const NEGATIVE_WORDS = [
  "angry",
  "upset",
  "unhappy",
  "frustrated",
  "complain",
  "complaint",
  "urgent",
  "now",
  "bad",
  "terrible",
  "awful",
  "delay",
  "disappointed",
]

export function analyzeSentiment(text: string): { sentiment: "positive" | "neutral" | "negative"; escalated: boolean } {
  const lower = text.toLowerCase()
  const negatives = NEGATIVE_WORDS.filter((w) => lower.includes(w)).length
  if (negatives >= 2) return { sentiment: "negative", escalated: true }
  if (negatives === 1) return { sentiment: "negative", escalated: false }
  return { sentiment: "neutral", escalated: false }
}
