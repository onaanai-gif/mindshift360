import type { PrimaryGoal } from "@/types/businessProfile";

export interface RecommendationHelp {
  paragraphs: string[];
  bulletItems?: string[];
  footer?: string;
}

export const RECOMMENDATION_HELP: Record<PrimaryGoal, RecommendationHelp> = {
  "Get More Customers": {
    paragraphs: [
      "Some businesses don't have all their contact details online yet.",
      "Don't try to update everything today.",
      "Start with only one task.",
      "Choose one:",
    ],
    bulletItems: [
      "Add your phone number",
      "Add your business location",
      "Add your WhatsApp number",
    ],
    footer: "Choose one small improvement today.",
  },
  "Increase Sales": {
    paragraphs: [
      "Choose one product or service.",
      "Check that the price is clearly shown.",
      "If customers have to ask the price, update it today.",
    ],
  },
  "Improve Customer Service": {
    paragraphs: [
      "Ask one customer:",
      '"What is one thing we could do better?"',
      "Simply listen.",
      "Write the answer down.",
    ],
  },
  "Organise My Business": {
    paragraphs: [
      "Take one sheet of paper.",
      "Write the three most important things you must complete today.",
      "Ignore everything else until those are finished.",
    ],
  },
};
