
interface SummaryProps {
  summary: string | null;
}

export function Summary({ summary }: SummaryProps) {
  if (!summary) return null;

  return (
    <div className="w-full max-w-2xl mt-8">
      <h2 className="text-xl font-semibold mb-4">Video Summary</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
      </div>
    </div>
  );
}