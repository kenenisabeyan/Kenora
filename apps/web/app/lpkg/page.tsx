"use client";

import React, { useState } from "react";
import { AppShell } from "../components/AppShell";
import {
  Network,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Layers,
  Sparkles,
  GitFork,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function LpkgPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedEntity, setSelectedEntity] = useState<string>("ent-1");

  const entities = [
    {
      id: "ent-1",
      name: "React Server Components",
      canonicalKey: "react-server-components",
      type: "Framework Paradigm",
      status: "Active Standard",
      validFrom: "2023-03-01",
      validUntil: null,
      supersedes: "Client-Side SPA Data Fetching",
      reason: "Streaming server component model reduces client JS payload by 65% and moves data fetching to the network edge.",
      confidence: 94,
      category: "Frontend Architecture",
      relations: [
        { target: "Next.js App Router", relation: "implements", weight: 0.98 },
        { target: "Streaming SSR", relation: "relies_on", weight: 0.95 },
        { target: "Client-Side SPA", relation: "supersedes", weight: 0.88 },
      ],
      evolution: [
        { date: "2020-12", event: "Initial RFC Published by React Core Team" },
        { date: "2023-05", event: "Next.js 13.4 declares App Router production-ready" },
        { date: "2026-02", event: "Standardized across all major meta-frameworks" },
      ],
    },
    {
      id: "ent-2",
      name: "Node.js Native ESM Module Standard",
      canonicalKey: "nodejs-native-esm",
      type: "Runtime Specification",
      status: "Active Standard",
      validFrom: "2024-04-24",
      validUntil: null,
      supersedes: "CommonJS Require Specification",
      reason: "ESM native support finalized across core standard runtimes with native compile cache support.",
      confidence: 98,
      category: "Runtime Architecture",
      relations: [
        { target: "V8 Engine", relation: "executed_by", weight: 0.99 },
        { target: "CommonJS", relation: "deprecates", weight: 0.92 },
      ],
      evolution: [
        { date: "2018-05", event: "Experimental ESM loader flag in Node.js 10" },
        { date: "2021-10", event: "Conditional package exports standardized" },
        { date: "2024-04", event: "Native require(esm) and compile cache default" },
      ],
    },
    {
      id: "ent-3",
      name: "QUIC Transport Layer / HTTP/3",
      canonicalKey: "rfc-9114-quic",
      type: "Protocol Standard",
      status: "Active Standard",
      validFrom: "2022-06-01",
      validUntil: null,
      supersedes: "TCP Head-of-Line Blocking",
      reason: "Multiplexed stream transport over UDP eliminates packet-loss stall across concurrent HTTP streams.",
      confidence: 99,
      category: "Networking & Transport",
      relations: [
        { target: "RFC 9114", relation: "specified_in", weight: 1.0 },
        { target: "HTTP/2", relation: "supersedes", weight: 0.94 },
      ],
      evolution: [
        { date: "2015-07", event: "Google Chrome initial QUIC experiments" },
        { date: "2022-06", event: "IETF formal RFC 9114 standardization" },
        { date: "2026-01", event: "Edge adoption exceeds 68% of global traffic" },
      ],
    },
    {
      id: "ent-4",
      name: "Drizzle ORM Compile-Time Schema",
      canonicalKey: "drizzle-orm-schema",
      type: "Data Access Paradigm",
      status: "Active Standard",
      validFrom: "2023-08-01",
      validUntil: null,
      supersedes: "Heavy Runtime Reflection ORMs",
      reason: "Zero-overhead TypeScript query builder with direct SQL compilation.",
      confidence: 92,
      category: "Persistence & Data",
      relations: [
        { target: "PostgreSQL pgvector", relation: "queries", weight: 0.96 },
        { target: "Traditional ORMs", relation: "outperforms", weight: 0.9 },
      ],
      evolution: [
        { date: "2023-01", event: "Initial release with serverless driver bindings" },
        { date: "2024-11", event: "pgvector and RLS policy first-class builders" },
      ],
    },
  ];

  const filteredEntities = entities.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" ? true : e.type.toLowerCase().includes(selectedType);
    return matchesSearch && matchesType;
  });

  const activeEntity = entities.find((e) => e.id === selectedEntity) || entities[0];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Network className="w-4 h-4" />
              <span>Living Professional Knowledge Graph (LPKG)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Temporal Entity & Paradigm Explorer
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Dynamically maps concepts, protocols, runtime shifts, supersession links, and epistemic confidence intervals across professional engineering history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 font-mono">
              Nodes: {entities.length} | Relations: 9 | Temporal Span: 2015-2026
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search concepts, protocols, runtimes, supersession links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            {["all", "framework", "runtime", "protocol"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-2 rounded-lg font-medium capitalize transition-colors ${
                  selectedType === t
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Entity Selector & Entity Detail Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Entities List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredEntities.map((ent) => {
              const isSelected = ent.id === activeEntity.id;
              return (
                <div
                  key={ent.id}
                  onClick={() => setSelectedEntity(ent.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-950/50"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-semibold text-indigo-400">
                      {ent.type}
                    </span>
                    <span className="text-emerald-400 font-semibold text-[11px]">
                      {ent.confidence}% Conf.
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-1">{ent.name}</h3>
                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 truncate">
                    <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span className="truncate">Supersedes: {ent.supersedes}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Node Inspector */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-indigo-400">
                  {activeEntity.category} · {activeEntity.type}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{activeEntity.name}</h2>
                <span className="font-mono text-xs text-slate-500">{activeEntity.canonicalKey}</span>
              </div>
              <div className="text-right">
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded font-semibold block">
                  {activeEntity.status}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">Valid Since: {activeEntity.validFrom}</span>
              </div>
            </div>

            {/* Supersession Architecture */}
            <div className="p-4 rounded-lg bg-[#0a0e18] border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Supersession Justification
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{activeEntity.reason}</p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Direct Predecessor:</span>
                <span className="text-rose-400 line-through font-medium">{activeEntity.supersedes}</span>
              </div>
            </div>

            {/* Graph Relations */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-indigo-400" />
                Semantic Graph Relations & Edge Weights
              </h3>
              <div className="space-y-2">
                {activeEntity.relations.map((rel, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-indigo-400 text-[11px] px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-900">
                        {rel.relation}
                      </span>
                      <span className="text-slate-200 font-medium">{rel.target}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">Weight: {rel.weight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evolution Timeline */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Temporal Evolution Milestones
              </h3>
              <div className="border-l-2 border-indigo-600/60 pl-4 space-y-3">
                {activeEntity.evolution.map((m, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 border border-slate-900"></span>
                    <span className="font-mono text-[10px] text-indigo-400 font-semibold">{m.date}</span>
                    <p className="text-xs text-slate-300 mt-0.5">{m.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Blast Radius & DAG Invariant Section */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Blast Radius Downstream Analysis (Agent AG-405)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> DAG Invariant Verified (0 Cycles)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Breadth-first graph traversal identifies dependent services, runtime bindings, and architectural layers impacted if this specification is deprecated or modified.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-sm font-bold text-white">1 Hop</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">3 Direct Clients</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-sm font-bold text-amber-400">2 Hops</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">7 Transitive Microservices</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-sm font-bold text-rose-400">Criticality</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Tier-1 Core Invariant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
