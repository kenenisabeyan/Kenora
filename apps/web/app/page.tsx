import React from 'react';

export default function HomeFoundationPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0B0F19] text-slate-100 p-8">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
            K
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">KENORA</h1>
            <p className="text-xs text-indigo-400 font-medium">AI-Powered Professional Intelligence Infrastructure</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            FOUNDATION SHELL READY
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full space-y-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-2">Kenora Foundation Shell (Task 001)</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            This application shell serves as the foundational user interface for Kenora. The core architecture is source-agnostic, multi-tenant ready, and decoupled across 16 core packages and 3 application runtimes.
          </p>
        </div>

        {/* Runtime Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Web Application</div>
            <div className="text-lg font-bold text-white">apps/web</div>
            <div className="text-xs text-emerald-400 mt-2 font-mono">Next.js App Router</div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Platform API</div>
            <div className="text-lg font-bold text-white">apps/api</div>
            <div className="text-xs text-indigo-400 mt-2 font-mono">NestJS / GET /health</div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Worker Daemon</div>
            <div className="text-lg font-bold text-white">apps/workers</div>
            <div className="text-xs text-amber-400 mt-2 font-mono">Node.js / BullMQ</div>
          </div>
        </div>

        {/* System Architecture Checklist */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Infrastructure Stack & Boundaries
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> PostgreSQL + pgvector (Drizzle ORM)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Redis Cache & Queue Infrastructure
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> NATS JetStream Event Backbone
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Source-Agnostic Adapter Contract
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Provider-Agnostic AI Gateway Interface
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Tenant Isolation & Untrusted Data Boundary
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
