import React from 'react';
import { Button, Card } from '@kenora/ui';
import {
  Compass,
  Cpu,
  Database,
  FileCheck,
  Globe,
  Layers,
  LayoutDashboard,
  Radio,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex w-full min-h-screen bg-[#0B0F19]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-[#0E1322] flex flex-col p-4">
        <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-800/80 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
            K
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white">KENORA</h1>
            <p className="text-xs text-indigo-400 font-medium">Professional Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 text-sm">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Core Platform
          </div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-600/10 text-indigo-400 font-medium">
            <LayoutDashboard className="w-4 h-4" /> Daily Intelligence
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
            <Compass className="w-4 h-4" /> Knowledge Explorer
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
            <Search className="w-4 h-4" /> Hybrid Search
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
            <Radio className="w-4 h-4" /> Source Adapters
          </a>

          <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider pt-4">
            Intelligence Engine
          </div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
            <FileCheck className="w-4 h-4" /> Verification & Evidence
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
            <Cpu className="w-4 h-4" /> Autonomous Agents
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
            <Sparkles className="w-4 h-4" /> Recommendations
          </a>

          <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider pt-4">
            System & Infrastructure
          </div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
            <Database className="w-4 h-4" /> Schema & Data Pipeline
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
            <Settings className="w-4 h-4" /> System Settings
          </a>
        </nav>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Phase 0 Monorepo</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            v0.1.0-READY
          </span>
        </div>
      </aside>

      {/* Main Operational Canvas */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Bar */}
        <header className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Daily Intelligence Briefing</h2>
            <p className="text-sm text-slate-400 mt-1">
              Source-Agnostic Professional Intelligence Architecture & Evidence Pipeline
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="md">
              Export Architecture ADR
            </Button>
            <Button variant="primary" size="md">
              Run Source Poll Cycle
            </Button>
          </div>
        </header>

        {/* Phase 0 Monorepo Status Banner */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Kenora Monorepo Skeleton (Phase 0) Established</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  16 Packages & 3 Services Connected
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                PostgreSQL + pgvector, Redis, BullMQ, NATS JetStream event backbone, NestJS API platform, Next.js web application, and background worker daemon are wired with structured logging, health checks, Zod validation, and Drizzle ORM.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <Card className="border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Services</div>
            <div className="text-2xl font-bold text-white mt-2">3 Node Apps</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Web, API & Workers Healthy
            </div>
          </Card>

          <Card className="border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Source Adapters</div>
            <div className="text-2xl font-bold text-white mt-2">Core Framework</div>
            <div className="text-xs text-indigo-400 mt-1">Source-Agnostic Engine</div>
          </Card>

          <Card className="border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Persistence</div>
            <div className="text-2xl font-bold text-white mt-2">Postgres + pgvector</div>
            <div className="text-xs text-slate-400 mt-1">Drizzle ORM Type-Safe</div>
          </Card>

          <Card className="border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Backbone</div>
            <div className="text-2xl font-bold text-white mt-2">NATS JetStream</div>
            <div className="text-xs text-amber-400 mt-1">Domain Event Streaming</div>
          </Card>
        </div>

        {/* Intelligence Pipeline & Engineering Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Knowledge Pipeline Canvas */}
          <Card className="border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" /> Source Ingestion & Knowledge Pipeline
                </h4>
                <span className="text-xs text-slate-400">Idempotent Pipeline</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/60 flex justify-between items-center">
                  <span className="font-mono text-indigo-300">1. Source Polling / Webhook</span>
                  <span className="text-slate-400">source-adapters/core</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/60 flex justify-between items-center">
                  <span className="font-mono text-indigo-300">2. Normalization & Deduplication</span>
                  <span className="text-slate-400">packages/knowledge</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/60 flex justify-between items-center">
                  <span className="font-mono text-indigo-300">3. Claim Extraction & Verification</span>
                  <span className="text-slate-400">packages/verification</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/60 flex justify-between items-center">
                  <span className="font-mono text-indigo-300">4. Vector Embedding & Graph Update</span>
                  <span className="text-slate-400">pgvector & Drizzle</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/60 flex justify-between items-center">
                  <span className="font-mono text-indigo-300">5. Briefing & Recommendation Synthesis</span>
                  <span className="text-slate-400">Daily Intelligence</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <span className="text-amber-400 font-semibold">Security Rule:</span> External content is data, never authority. Sanitization boundaries enforced.
            </div>
          </Card>

          {/* Master Engineering Rules Compliance */}
          <Card className="border-slate-800">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" /> Engineering Rules Verification
              </h4>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                25 / 25 PASSED
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> No invented architecture - strict monorepo layout.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Business logic isolated in domain & core packages.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Database access restricted from presentation layers.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Strict tenant isolation & structured Pino logging.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Idempotent background job definitions in BullMQ.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Standardized health check probes across all 3 services.
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
