"use client";

import React, { useState } from "react";
import { AppShell } from "../components/AppShell";
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scale,
  TrendingUp,
  ExternalLink,
  ShieldAlert,
  BarChart2,
  Layers,
  Zap,
} from "lucide-react";

export default function BenchmarksPage() {
  const [selectedSuite, setSelectedSuite] = useState("all");

  const benchmarks = [
    {
      id: "bm-1",
      model: "Frontier Reasoner v3",
      suite: "SWE-bench Verified",
      vendorScore: 58.4,
      reproducedScore: 58.2,
      delta: -0.34,
      status: "Dual-Verified",
      auditor: "Stanford CRFM & Berkeley BAIR",
      isDualVerified: true,
      throughput: "78 tok/s",
      costPerMillion: "$3.50",
      notes: "Independent dual-reproduction confirmed result within 0.34% of vendor claims across 500 instances.",
    },
    {
      id: "bm-2",
      model: "OmniModal Pro 2.5",
      suite: "MMLU-Pro",
      vendorScore: 84.1,
      reproducedScore: 83.9,
      delta: -0.24,
      status: "Dual-Verified",
      auditor: "Independent Systems Lab",
      isDualVerified: true,
      throughput: "112 tok/s",
      costPerMillion: "$1.80",
      notes: "Zero prompt contamination detected. Tested against held-out reasoning subset.",
    },
    {
      id: "bm-3",
      model: "UltraCode Enterprise v1",
      suite: "HumanEval",
      vendorScore: 92.4,
      reproducedScore: 86.1,
      delta: -6.82,
      status: "Refuted Exaggeration",
      auditor: "Kenora Systems Lab",
      isDualVerified: true,
      throughput: "65 tok/s",
      costPerMillion: "$4.00",
      notes: "Vendor score exhibited 6.82% divergence under canonical test harnesses; vendor likely evaluated against leaked canonical tests.",
    },
    {
      id: "bm-4",
      model: "DeepReason Open 70B",
      suite: "Math-500",
      vendorScore: 81.2,
      reproducedScore: 81.0,
      delta: -0.25,
      status: "Dual-Verified",
      auditor: "Berkeley BAIR",
      isDualVerified: true,
      throughput: "95 tok/s",
      costPerMillion: "$0.90",
      notes: "Open-weight model reproduced on standard 8xH100 SXM5 cluster with vLLM engine.",
    },
  ];

  const filtered =
    selectedSuite === "all"
      ? benchmarks
      : benchmarks.filter((b) => b.suite.toLowerCase().includes(selectedSuite));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>AI Ecosystem Intelligence Pillar</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Dual-Reproduction Benchmark Protocol
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Eliminates marketing exaggeration and benchmark contamination through independent dual-auditor reproduction runs and cost-normalized efficiency ratings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 font-mono">
              Divergence Threshold: &gt; ±3.5% triggers REFUTED status
            </span>
          </div>
        </div>

        {/* Metric Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-xs uppercase font-semibold">Reproduction Verified</span>
            <div className="text-2xl font-bold text-emerald-400">91.4%</div>
            <span className="text-[11px] text-slate-500">Across 64 frontier model runs</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-xs uppercase font-semibold">Flagged Divergences</span>
            <div className="text-2xl font-bold text-rose-400">6 Models</div>
            <span className="text-[11px] text-slate-500">Exceeded ±3.5% divergence</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-xs uppercase font-semibold">Independent Auditors</span>
            <div className="text-2xl font-bold text-indigo-400">3 Labs</div>
            <span className="text-[11px] text-slate-500">Stanford CRFM, Berkeley BAIR, Kenora</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-xs uppercase font-semibold">Efficiency Standard</span>
            <div className="text-2xl font-bold text-white">Tok / $ / Watt</div>
            <span className="text-[11px] text-slate-500">Hardware normalized metrics</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 text-xs">
          {["all", "swe-bench", "mmlu", "humaneval", "math"].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSuite(s)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                selectedSuite === s
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Benchmarks Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3">Benchmark Suite</th>
                  <th className="py-2.5 px-3">Vendor Claim</th>
                  <th className="py-2.5 px-3">Reproduced Score</th>
                  <th className="py-2.5 px-3">Divergence (Δ)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Auditors</th>
                  <th className="py-2.5 px-3">Throughput & Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map((bm) => (
                  <tr key={bm.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-white">{bm.model}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">
                        {bm.suite}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{bm.vendorScore}%</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">{bm.reproducedScore}%</td>
                    <td className="py-3 px-3 font-mono">
                      <span
                        className={
                          Math.abs(bm.delta) > 3.5 ? "text-rose-400 font-bold" : "text-emerald-400"
                        }
                      >
                        {bm.delta > 0 ? `+${bm.delta}%` : `${bm.delta}%`}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          bm.status.includes("Verified")
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : "bg-rose-950 text-rose-300 border border-rose-800"
                        }`}
                      >
                        {bm.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{bm.auditor}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {bm.throughput} · {bm.costPerMillion}/M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Benchmark Protocol Documentation Note */}
        <div className="p-5 rounded-xl bg-[#0a0e18] border border-slate-800 text-xs space-y-2">
          <span className="font-semibold text-indigo-400 uppercase tracking-wider block">
            Kenora Dual-Reproduction Ground Rules
          </span>
          <p className="text-slate-300 leading-relaxed">
            1. Every model is evaluated with standardized prompt templates without system instructions that hint at benchmark solutions.  
            2. Dual executions must run in isolated physical hardware clusters to eliminate thermal throttling variance.  
            3. Results with divergence &gt; 3.5% are highlighted directly to enterprise teams to prevent flawed architectural decisions based on inflated marketing claims.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
