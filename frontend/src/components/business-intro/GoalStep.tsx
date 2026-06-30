import { PRIMARY_GOALS, PrimaryGoal } from "@/types/businessProfile";

interface GoalStepProps {
  errorMessage?: string;
  disabled?: boolean;
  onSelect: (goal: PrimaryGoal) => void;
}

export function GoalStep({ errorMessage, disabled, onSelect }: GoalStepProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        What&apos;s your primary business goal right now?
      </h1>
      <div className="flex flex-col gap-3" role="group" aria-label="Primary business goal">
        {PRIMARY_GOALS.map((goal) => (
          <button
            key={goal}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(goal)}
            className="w-full rounded-lg border border-gray-300 px-6 py-4 text-left text-lg font-medium text-gray-900 transition-colors hover:border-blue-600 hover:bg-blue-50 active:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {goal}
          </button>
        ))}
      </div>
      {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
    </div>
  );
}
