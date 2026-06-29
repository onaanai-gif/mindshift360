interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const percentComplete = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full" aria-label={`Step ${currentStep} of ${totalSteps}`}>
      <div className="mb-2 text-sm font-medium text-gray-500">
        Step {currentStep} of {totalSteps}
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </div>
  );
}
