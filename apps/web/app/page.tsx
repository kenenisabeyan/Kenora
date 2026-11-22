"use client";

import React, { useState } from "react";

export default function KenoraDashboard() {
  const [activeTab, setActiveTab] = useState<
    "briefing" | "graph" | "ai_benchmarks" | "agents"
  >("briefing");

  // Sample verified intelligence items
  const keyInsights = [
    {
      id: "ki-1",
      title: "RFC 9114 HTTP/3 Formal Specification Finalized",
      tier: "Tier 1 (Official RFC)",
      confidence: 99,
      category: "Networking / Protocol",
      url: "https://datatracker.ietf.org/doc/rfc9114/",
      summary:
        "IETF finalizes HTTP/3 over QUIC transport. Disregard informal community posts asserting TCP fallback availability.",
    },
    {
      id: "ki-2",
      title: "CVE-2026-4412 Critical Transport Handshake Vulnerability",
      tier: "Tier 1 (NVD Advisory)",
      confidence: 98,
      category: "Security / Advisory",
      url: "https://nvd.nist.gov/vuln/detail/CVE-2026-4412",
      summary:
        "Buffer overflow in legacy TLS extensions. CVSS 9.8. Patch deployed in runtime minor release.",
    },
    {
      id: "ki-3",
      title: "Node.js v24 Native Compile Cache & ESM Default Standard",
      tier: "Tier 1 (Official Release)",
      confidence: 96,
      category: "Runtime Architecture",
      url: "https://nodejs.org/en/blog/release/v24.0.0",
      summary:
        "Native compile-cache enabled by default, superseding previous CommonJS guidance.",
    },
  ];

  // LPKG Entities
  const graphEntities = [
    {
      id: "ent-1",
      name: "React Server Components",
      type: "Framework Paradigm",
      status: "Active",
      validFrom: "2023-03-01",
      supersedes: "Client-Side SPA Data Fetching",
      reason: "Streaming server component model reduces client JS payload by 65%",
      confidence: 94,
    },
    {
      id: "ent-2",
      name: "Node.js Module Standard",
      type: "Specification",
      status: "Active",
      validFrom: "2024-04-24",
      supersedes: "CommonJS Require Specification",
      reason: "ESM native support finalized across core standard runtimes",
      confidence: 98,
    },
    {
      id: "ent-3",
      name: "QUIC Transport Layer",
      type: "Standard Protocol",
      status: "Active",
      validFrom: "2022-06-01",
      supersedes: "TCP Head-of-Line Blocking",
      reason: "Multiplexed stream transport over UDP",
      confidence: 99,
    },
  ];

  // AI Benchmarks
  const aiBenchmarks = [
    {
      model: "Frontier Reasoner v3",
      benchmark: "SWE-bench Verified",
      vendorScore: 58.4,
      reproducedScore: 58.2,
      auditor: "Stanford CRFM & Berkeley BAIR",
      status: "Verified by Reproduction",
      confidence: 95,
      isDualVerified: true,
    },
    {
      model: "OmniModal Pro 2.5",
      benchmark: "MMLU-Pro",
      vendorScore: 84.1,
      reproducedScore: 83.9,
      auditor: "Independent Systems Lab",
      status: "Verified by Reproduction",
      confidence: 92,
      isDualVerified: true,
    },
    {
      model: "HyperFast-Coder 70B",
      benchmark: "HumanEval",
      vendorScore: 89.0,
      reproducedScore: 89.0,
      auditor: "Awaiting 2nd Laboratory",
      status: "Provisional (Vendor Reported)",
      confidence: 68,
      isDualVerified: false,
    },
    {
      model: "VendorX-Ultra Preview",
      benchmark: "AgentBench RealWorld",
      vendorScore: 76.5,
      reproducedScore: 54.0,
      auditor: "MIT Decentralized Lab",
      status: "Disputed (High Variance)",
      confidence: 35,
      isDualVerified: false,
    },
  ];

  // 28 Agents
  const agentClusters = [
    {
      name: "Acquisition Cluster",
      count: 6,
      description: "Autonomous deep-crawlers, RSS monitors, Git watchers, arXiv ingest, CVE advisory trackers.",
      agents: ["SourceCrawler", "RssFeed", "GitRepoWatcher", "PaperIngest", "CommunityDiscussion", "AdvisoryWatch"],
    },
    {
      name: "Understanding Cluster",
      count: 6,
      description: "Named entity extractors, claim parsers, semantic ontology aligners, and vocabulary tuners.",
      agents: ["EntityExtractor", "ClaimParser", "SemanticAligner", "ContextNormalizer", "TaxonomyClassifier", "VocabularyTuner"],
    },
    {
      name: "Verification Cluster",
      count: 6,
      description: "Bayesian corroboration, contradiction detectors, trust scoring, and benchmark auditors.",
      agents: ["MultiSourceCorroborator", "ContradictionDetector", "SourceTrustScorer", "BenchmarkVerifier", "TemporalValidity", "EvidenceAuditor"],
    },
    {
      name: "Delivery Cluster",
      count: 5,
      description: "Daily briefing synthesizers, 9-question analyzers, and intelligent compression engines.",
      agents: ["DailyBriefingSynthesizer", "NineQuestionAnalyzer", "KnowledgeCompressor", "AlertDispatcher", "WeeklySynthesis"],
    },
    {
      name: "Governance Cluster",
      count: 5,
      description: "Bias indexing, cryptographic audit ledger recorders, privacy sanitizers, and license enforcers.",
      agents: ["BiasDetector", "AuditLedger", "PrivacySanitizer", "DeprecationMonitor", "ComplianceEnforcer"],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#090D16] text-slate-100 font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#0B111E]/90 backdrop-blur-md border-b border-slate-800/80 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">KENORA</span>
                <span className="text-xs font-mono uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                  v3.0 Whitepaper
                </span>
              </div>
              <p className="text-xs text-slate-400">
                The World&apos;s AI-Powered Professional Knowledge Infrastructure
              </p>
            </div>
          </div>

          {/* Subsystem Health Pills */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">LPKG & MSVF Active</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-slate-300">28 Agents Fleet</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-slate-300">API Port 4000</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-8 py-8 space-y-8 flex-1">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab("briefing")}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === "briefing"
                ? "border-indigo-500 text-white font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Daily Professional Intelligence (9-Questions)
          </button>
          <button
            onClick={() => setActiveTab("graph")}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === "graph"
                ? "border-indigo-500 text-white font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Living Knowledge Graph (LPKG)
          </button>
          <button
            onClick={() => setActiveTab("ai_benchmarks")}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === "ai_benchmarks"
                ? "border-indigo-500 text-white font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            AI Ecosystem Benchmarks
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === "agents"
                ? "border-indigo-500 text-white font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            28-Agent Cluster Fleet
          </button>
        </div>

        {/* TAB 1: DAILY PROFESSIONAL INTELLIGENCE */}
        {activeTab === "briefing" && (
          <div className="space-y-6">
            {/* Executive Headline & Compression Ratio */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-[#121929] border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-1">
                  Verified Executive Briefing
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Daily Professional Intelligence Report
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesized via Multi-Source Verification Framework (MSVF) & Intelligent Knowledge Compression (IKC)
                </p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Distillation Ratio</div>
                  <div className="text-sm font-bold text-emerald-400">
                    99.2% Noise Eliminated
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <div className="text-xs text-slate-400">Distilled Items</div>
                  <div className="text-sm font-bold text-indigo-400">
                    3 High-Impact Signals
                  </div>
                </div>
              </div>
            </div>

            {/* 9-Question Decision Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">1</span>
                  What Changed?
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  RFC 9114 finalized HTTP/3 over QUIC transport. CVE-2026-4412 patched buffer overflow in cryptographic handshakes. Node.js v24 standardized compile-cache.
                </p>
              </div>

              <div className="p-5 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">2</span>
                  Why It Matters?
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Direct impact on latency SLAs and supply chain integrity. Unverified benchmark claims risk costly architecture misinvestments.
                </p>
              </div>

              <div className="p-5 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">3</span>
                  Who Is Affected?
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Distributed Architects", "Staff Backend Engineers", "Security Officers", "Platform Leads"].map(
                    (role) => (
                      <span key={role} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {role}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="p-5 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">4</span>
                  Confidence & Evidence
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-emerald-400">98% Avg</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    Tier 1 Official Standard
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Backed by cryptographic provenance and primary source RFC links.
                </p>
              </div>

              <div className="p-5 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">5</span>
                  Recommended Action
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Update edge TLS termination configs to isolate unpatched ciphers. Pin dependency lockfiles against advisory CVE-2026-4412.
                </p>
              </div>

              <div className="p-5 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">6</span>
                  What to Learn?
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Adopt temporal graph structures (LPKG) and understand dual-reproduction benchmark requirements for AI agent evaluations.
                </p>
              </div>

              <div className="p-5 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">7</span>
                  What to Ignore?
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ignore single-vendor synthetic benchmark marketing without dual reproduction. Filter out unverified social media deprecation rumors.
                </p>
              </div>

              <div className="p-5 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">8</span>
                  Emerging Trends
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Decisive shift toward zero-copy temporal serialization and independent reproduction verification layers in AI infrastructure.
                </p>
              </div>

              <div className="p-5 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">9</span>
                  Forecast (60 Days)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Standards bodies are projected to enforce dual-lab verification on all generative reasoning benchmarks before RFC adoption.
                </p>
              </div>
            </div>

            {/* Key Verified Intelligence Stream */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Distilled Intelligence Signals
              </h3>
              <div className="divide-y divide-slate-800">
                {keyInsights.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                          {item.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{item.summary}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-mono text-emerald-400 font-bold">{item.confidence}% Conf.</div>
                        <div className="text-[10px] text-slate-500">Bayesian MSVF</div>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded transition-colors"
                      >
                        Evidence ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVING PROFESSIONAL KNOWLEDGE GRAPH (LPKG) */}
        {activeTab === "graph" && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <h2 className="text-xl font-bold text-white">Living Professional Knowledge Graph (LPKG)</h2>
              <p className="text-xs text-slate-400">
                Temporal entity-relation graph featuring non-destructive knowledge evolution, validity intervals, and time-travel querying.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {graphEntities.map((ent) => (
                <div key={ent.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                      {ent.type}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">{ent.confidence}% Confidence</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{ent.name}</h3>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">Valid From: {ent.validFrom}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="text-[11px] text-amber-400 font-medium">Supersedes: {ent.supersedes}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{ent.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AI ECOSYSTEM BENCHMARKS */}
        {activeTab === "ai_benchmarks" && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <h2 className="text-xl font-bold text-white">AI Ecosystem Benchmark Reproduction Protocol</h2>
              <p className="text-xs text-slate-400">
                Enforcing the Whitepaper mandate: vendor-reported scores remain capped at provisional confidence until confirmed by at least two independent research laboratories.
              </p>
            </div>

            <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Foundation Model</th>
                    <th className="px-5 py-3">Benchmark</th>
                    <th className="px-5 py-3">Vendor Score</th>
                    <th className="px-5 py-3">Reproduced Score</th>
                    <th className="px-5 py-3">Auditing Labs</th>
                    <th className="px-5 py-3">Verification Status</th>
                    <th className="px-5 py-3 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {aiBenchmarks.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-semibold text-white">{b.model}</td>
                      <td className="px-5 py-4 font-mono text-indigo-400">{b.benchmark}</td>
                      <td className="px-5 py-4 font-mono">{b.vendorScore}%</td>
                      <td className="px-5 py-4 font-mono font-bold">{b.reproducedScore}%</td>
                      <td className="px-5 py-4 text-slate-400">{b.auditor}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border ${
                            b.isDualVerified
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : b.status.includes("Disputed")
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold">
                        <span className={b.confidence >= 90 ? "text-emerald-400" : "text-amber-400"}>
                          {b.confidence}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: 28-AGENT CLUSTER ARCHITECTURE */}
        {activeTab === "agents" && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <h2 className="text-xl font-bold text-white">Kenora 28-Agent Autonomous Cluster Architecture</h2>
              <p className="text-xs text-slate-400">
                Five coordinated clusters executing acquisition, understanding, verification, delivery, and governance in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {agentClusters.map((cluster) => (
                <div key={cluster.name} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{cluster.name}</h3>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">
                      {cluster.count} Agents Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{cluster.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                    {cluster.agents.map((agent) => (
                      <span
                        key={agent}
                        className="text-[11px] font-mono bg-slate-800/80 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded"
                      >
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-8 text-center text-xs text-slate-500">
        Kenora © 2026 · Living Professional Knowledge Infrastructure · Multi-Source Verification Framework (MSVF) · All Rights Reserved
      </footer>
    </div>
  );
}
