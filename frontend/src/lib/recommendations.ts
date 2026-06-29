import type { PrimaryGoal } from "@/types/businessProfile";

export interface Recommendation {
  key: string;
  title: string;
  recommendation: string;
  checklistItems?: string[];
  estimatedTime: string;
}

export const RECOMMENDATIONS: Record<PrimaryGoal, Recommendation> = {
  "Get More Customers": {
    key: "get_more_customers",
    title: "Help More People Find Your Business",
    recommendation:
      "Make sure your business information is easy to find. Check that your TikTok profile, WhatsApp Business profile or Facebook page clearly displays:",
    checklistItems: ["Business Name", "Phone Number", "Business Location"],
    estimatedTime: "10 minutes",
  },
  "Increase Sales": {
    key: "increase_sales",
    title: "Make Buying Easier",
    recommendation:
      "Review your pricing and make sure customers can clearly understand what you sell and how to buy from you.",
    estimatedTime: "10 minutes",
  },
  "Improve Customer Service": {
    key: "improve_customer_service",
    title: "Improve Customer Experience",
    recommendation:
      "Ask one recent customer for honest feedback about your service and write down one improvement you can make this week.",
    estimatedTime: "10 minutes",
  },
  "Organise My Business": {
    key: "organise_my_business",
    title: "Organise Your Daily Work",
    recommendation: "Write down today's three most important business tasks before you begin work.",
    estimatedTime: "5 minutes",
  },
};
