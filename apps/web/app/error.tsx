"use client";

import React, { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Kenora Web Client Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#0B0F19] text-slate-100 p-6">
      <div className="max-w-md w-full p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-bold text-rose-500 mb-2">
          Application Error
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          {error.message || "An unexpected runtime error occurred."}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
