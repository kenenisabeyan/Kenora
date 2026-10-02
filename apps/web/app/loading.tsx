import React from "react";

export default function LoadingBoundary() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#0B0F19] text-slate-100 p-6">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-400">
          Loading Kenora Foundation Shell...
        </span>
      </div>
    </div>
  );
}
