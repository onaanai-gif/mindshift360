import { FormEvent, useState } from "react";

interface TextStepProps {
  question: string;
  placeholder: string;
  initialValue: string;
  errorMessage?: string;
  onSubmit: (value: string) => void;
}

export function TextStep({
  question,
  placeholder,
  initialValue,
  errorMessage,
  onSubmit,
}: TextStepProps) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">{question}</h1>
      <div>
        <input
          autoFocus
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-4 text-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-invalid={Boolean(errorMessage)}
        />
        {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        Continue
      </button>
    </form>
  );
}
