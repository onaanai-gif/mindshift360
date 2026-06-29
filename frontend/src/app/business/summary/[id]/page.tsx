import { BusinessSummary } from "@/components/business-summary/BusinessSummary";

interface BusinessSummaryPageProps {
  params: { id: string };
}

export default function BusinessSummaryPage({ params }: BusinessSummaryPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <BusinessSummary profileId={params.id} />
      </div>
    </main>
  );
}
