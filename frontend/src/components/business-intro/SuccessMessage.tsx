export function SuccessMessage() {
  return (
    <div className="flex w-full flex-col items-center gap-8 text-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome to MINDSHIFT360 Business Growth Partner.
        </h1>
        <p className="text-lg text-gray-700">Thank you.</p>
        <p className="text-lg text-gray-700">I&apos;ve started learning about your business.</p>
        <p className="text-lg text-gray-700">
          We&apos;ll grow it together one practical step at a time.
        </p>
      </div>
      <button
        type="button"
        className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        Continue
      </button>
    </div>
  );
}
