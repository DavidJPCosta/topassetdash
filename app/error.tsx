"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-200 mb-2">
          Something went wrong
        </h2>
        <p className="text-slate-400 mb-4">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
