import type {
  BusinessProfile,
  BusinessProfileFieldErrors,
  BusinessProfileInput,
  PrimaryGoal,
} from "@/types/businessProfile";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const FIELD_NAME_BY_API_FIELD: Record<string, keyof BusinessProfileFieldErrors> = {
  business_name: "businessName",
  business_type: "businessType",
  town_city: "townCity",
  primary_goal: "primaryGoal",
};

export class BusinessProfileValidationError extends Error {
  fieldErrors: BusinessProfileFieldErrors;

  constructor(fieldErrors: BusinessProfileFieldErrors) {
    super("Validation failed");
    this.fieldErrors = fieldErrors;
  }
}

interface ApiErrorDetail {
  loc: Array<string | number>;
  msg: string;
}

function parseFieldErrors(detail: ApiErrorDetail[]): BusinessProfileFieldErrors {
  const fieldErrors: BusinessProfileFieldErrors = {};

  for (const error of detail) {
    const apiFieldName = error.loc[error.loc.length - 1];
    if (typeof apiFieldName !== "string") continue;

    const fieldName = FIELD_NAME_BY_API_FIELD[apiFieldName];
    if (fieldName) {
      fieldErrors[fieldName] = error.msg;
    }
  }

  return fieldErrors;
}

interface BusinessProfileApiResponse {
  id: number;
  business_name: string;
  business_type: string;
  town_city: string;
  primary_goal: PrimaryGoal;
}

function toBusinessProfile(response: BusinessProfileApiResponse): BusinessProfile {
  return {
    id: response.id,
    businessName: response.business_name,
    businessType: response.business_type,
    townCity: response.town_city,
    primaryGoal: response.primary_goal,
  };
}

export async function submitBusinessProfile(input: BusinessProfileInput): Promise<BusinessProfile> {
  const response = await fetch(`${API_BASE_URL}/api/business/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      business_name: input.businessName,
      business_type: input.businessType,
      town_city: input.townCity,
      primary_goal: input.primaryGoal,
    }),
  });

  if (response.status === 422) {
    const body = await response.json();
    throw new BusinessProfileValidationError(parseFieldErrors(body.detail ?? []));
  }

  if (!response.ok) {
    throw new Error("Something went wrong while saving your business profile.");
  }

  return toBusinessProfile(await response.json());
}

export async function getBusinessProfile(id: string | number): Promise<BusinessProfile> {
  const response = await fetch(`${API_BASE_URL}/api/business/profile/${id}`);

  if (!response.ok) {
    throw new Error("We couldn't find that business profile.");
  }

  return toBusinessProfile(await response.json());
}

export type RecommendationStatus = "completed" | "later" | "need_help" | "need_help_attempt";

export async function submitRecommendationProgress(
  businessProfileId: number,
  recommendationKey: string,
  status: RecommendationStatus,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/recommendations/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      business_profile_id: businessProfileId,
      recommendation_key: recommendationKey,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Something went wrong while saving your selection.");
  }
}
