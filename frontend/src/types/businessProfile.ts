export const PRIMARY_GOALS = [
  "Get More Customers",
  "Increase Sales",
  "Improve Customer Service",
  "Organise My Business",
] as const;

export type PrimaryGoal = (typeof PRIMARY_GOALS)[number];

export interface BusinessProfileInput {
  businessName: string;
  businessType: string;
  townCity: string;
  primaryGoal: PrimaryGoal | null;
}

export interface BusinessProfileFieldErrors {
  businessName?: string;
  businessType?: string;
  townCity?: string;
  primaryGoal?: string;
}
