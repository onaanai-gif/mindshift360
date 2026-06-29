import { BusinessIntroWizard } from "@/components/business-intro/BusinessIntroWizard";

export default function BusinessIntroPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <BusinessIntroWizard />
      </div>
    </main>
  );
}
