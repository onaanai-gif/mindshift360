"use client";

import { useState } from "react";

import { BusinessProfileValidationError, submitBusinessProfile } from "@/lib/api";
import type {
  BusinessProfileFieldErrors,
  BusinessProfileInput,
  PrimaryGoal,
} from "@/types/businessProfile";

import { GoalStep } from "./GoalStep";
import { ProgressIndicator } from "./ProgressIndicator";
import { SuccessMessage } from "./SuccessMessage";
import { TextStep } from "./TextStep";

const TOTAL_STEPS = 4;

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export function BusinessIntroWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BusinessProfileInput>({
    businessName: "",
    businessType: "",
    townCity: "",
    primaryGoal: null,
  });
  const [fieldErrors, setFieldErrors] = useState<BusinessProfileFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedProfileId, setSavedProfileId] = useState<number | null>(null);

  function goToNextStep() {
    setFieldErrors({});
    setStep((current) => current + 1);
  }

  function handleBusinessNameSubmit(value: string) {
    if (isBlank(value)) {
      setFieldErrors({ businessName: "Business name is required." });
      return;
    }
    setFormData((current) => ({ ...current, businessName: value }));
    goToNextStep();
  }

  function handleBusinessTypeSubmit(value: string) {
    if (isBlank(value)) {
      setFieldErrors({ businessType: "Business type is required." });
      return;
    }
    setFormData((current) => ({ ...current, businessType: value }));
    goToNextStep();
  }

  function handleTownCitySubmit(value: string) {
    if (isBlank(value)) {
      setFieldErrors({ townCity: "Town / city is required." });
      return;
    }
    setFormData((current) => ({ ...current, townCity: value }));
    goToNextStep();
  }

  async function handlePrimaryGoalSelect(goal: PrimaryGoal) {
    const completeProfile: BusinessProfileInput = { ...formData, primaryGoal: goal };
    setFormData(completeProfile);
    setSubmitError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const savedProfile = await submitBusinessProfile(completeProfile);
      setSavedProfileId(savedProfile.id);
    } catch (error) {
      if (error instanceof BusinessProfileValidationError) {
        setFieldErrors(error.fieldErrors);
      } else {
        setSubmitError("We couldn't save your business profile. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (savedProfileId !== null) {
    return <SuccessMessage profileId={savedProfileId} />;
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <ProgressIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

      {step === 1 && (
        <TextStep
          question="What's your business name?"
          placeholder="e.g. Acme Bakery"
          initialValue={formData.businessName}
          errorMessage={fieldErrors.businessName}
          onSubmit={handleBusinessNameSubmit}
        />
      )}

      {step === 2 && (
        <TextStep
          question="What type of business is it?"
          placeholder="e.g. Bakery"
          initialValue={formData.businessType}
          errorMessage={fieldErrors.businessType}
          onSubmit={handleBusinessTypeSubmit}
        />
      )}

      {step === 3 && (
        <TextStep
          question="Which town or city are you based in?"
          placeholder="e.g. Lagos"
          initialValue={formData.townCity}
          errorMessage={fieldErrors.townCity}
          onSubmit={handleTownCitySubmit}
        />
      )}

      {step === 4 && (
        <GoalStep
          errorMessage={fieldErrors.primaryGoal ?? submitError ?? undefined}
          disabled={isSubmitting}
          onSelect={handlePrimaryGoalSelect}
        />
      )}

      {isSubmitting && <p className="text-center text-sm text-gray-500">Saving...</p>}
    </div>
  );
}
