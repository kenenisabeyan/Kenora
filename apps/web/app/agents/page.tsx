"use client";

import React, { useState } from "react";
import { AppShell } from "../components/AppShell";
import {
  Bot,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Radio,
  Sparkles,
  Zap,
} from "lucide-react";

export default function AgentsPage() {
  const [activeCluster, setActiveCluster] = useState<number>(1);

  const clusters = [
    {
      id: 1,
      name: "Acquisition Cluster",
      count: 5,
      description: "Ingests raw sources, changelogs, RFC specs, CVE advisories, and rejects promotional churn.",
      agents: [
        { name: "Source Ingestion Agent", role: "Continuous connector polling across Git, RSS & APIs", state: "PROCESSING", tasks: "142,390", latency: "14ms", memory: "18MB" },
        { name: "Changelog & Release Agent", role: "Parses semver diffs, commit histories & tags", state: "IDLE", tasks: "48,110", latency: "32ms", memory: "22MB" },
        { name: "Community Discourse Agent", role: "Extracts consensus & debates from RFC discussions", state: "PROCESSING", tasks: "89,200", latency: "45ms", memory: "28MB" },
        { name: "Academic & Spec Agent", role: "Ingests W3C, TC39, IETF, NIST & ArXiv publications", state: "IDLE", tasks: "12,940", latency: "58ms", memory: "31MB" },
        { name: "Noise & Spam Rejecter", role: "Autonomous heuristic & semantic noise elimination", state: "PROCESSING", tasks: "219,400", latency: "6ms", memory: "14MB" },
      ],
    },
    {
      id: 2,
      name: "Understanding Cluster",
      count: 6,
      description: "Decomposes claims into semantic triples, normalizes context, and maps dependency topologies.",
      agents: [
        { name: "Claim Decomposition Agent", role: "Extracts Subject-Predicate-Object claim triples", state: "PROCESSING", tasks: "168,900", latency: "38ms", memory: "42MB" },
        { name: "Entity Disambiguation Agent", role: "Resolves polysemous terms to canonical LPKG nodes", state: "IDLE", tasks: "95,400", latency: "29ms", memory: "36MB" },
        { name: "Taxonomy Classifier", role: "Classifies claims into domain ontology verticals", state: "PROCESSING", tasks: "131,200", latency: "19ms", memory: "24MB" },
        { name: "Context Normalization Agent", role: "Harmonizes temporal frames and runtime contexts", state: "IDLE", tasks: "84,000", latency: "22ms", memory: "27MB" },
        { name: "Code Artifact Analyzer", role: "AST parsing, type signature inspection & diff evaluation", state: "PROCESSING", tasks: "62,500", latency: "74ms", memory: "65MB" },
        { name: "Dependency Topology Agent", role: "Maps transitive package dependency graphs", state: "IDLE", tasks: "43,800", latency: "48ms", memory: "51MB" },
      ],
    },
    {
      id: 3,
      name: "Verification Cluster",
      count: 6,
      description: "Applies Bayesian corroboration, adjudicates contradictions, and executes dual-reproduction benchmark tests.",
      agents: [
        { name: "Cross-Source Corroborator", role: "Bayesian evidence updating across independent sources", state: "PROCESSING", tasks: "155,200", latency: "31ms", memory: "38MB" },
        { name: "Contradiction Adjudicator", role: "Three-step precedence conflict resolution", state: "IDLE", tasks: "34,900", latency: "44ms", memory: "32MB" },
        { name: "Temporal Fact Decay Agent", role: "Applies exponential half-life decay to provisional claims", state: "IDLE", tasks: "28,100", latency: "18ms", memory: "19MB" },
        { name: "Dual-Reproduction Benchmark Agent", role: "Orchestrates independent AI test harness runs", state: "PROCESSING", tasks: "8,920", latency: "320ms", memory: "112MB" },
        { name: "Security Vulnerability Verifier", role: "Validates CVSS scores and patch confirmations", state: "IDLE", tasks: "19,400", latency: "52ms", memory: "40MB" },
        { name: "Epistemic Confidence Scorer", role: "Computes final calibrated confidence probability vector", state: "PROCESSING", tasks: "155,200", latency: "15ms", memory: "21MB" },
      ],
    },
    {
      id: 4,
      name: "Delivery Cluster",
      count: 6,
      description: "Synthesizes the Daily 9-Question Matrix, routes hybrid queries, and generates proactive stack alerts.",
      agents: [
        { name: "9-Question Synthesizer", role: "Generates the Daily 9-Question Decision Matrix", state: "PROCESSING", tasks: "24,800", latency: "85ms", memory: "78MB" },
        { name: "Query Routing Agent", role: "Dispatches hybrid search across sparse BM25 and dense vectors", state: "PROCESSING", tasks: "492,000", latency: "9ms", memory: "33MB" },
        { name: "Briefing Generator", role: "Formats executive, engineering & security views", state: "IDLE", tasks: "38,200", latency: "41ms", memory: "39MB" },
        { name: "Proactive Alert Dispatcher", role: "Triggers notifications for critical CVEs and breaking changes", state: "IDLE", tasks: "14,500", latency: "12ms", memory: "16MB" },
        { name: "Code Impact Assessor", role: "Calculates breaking change blast radius on tenant repos", state: "PROCESSING", tasks: "29,400", latency: "98ms", memory: "84MB" },
        { name: "Personalization Coordinator", role: "Customizes intelligence density based on team role", state: "IDLE", tasks: "51,200", latency: "24ms", memory: "30MB" },
      ],
    },
    {
      id: 5,
      name: "Governance Cluster",
      count: 5,
      description: "Maintains the SHA-256 cryptographic audit ledger, scrubs secrets/PII, and monitors SLA availability.",
      agents: [
        { name: "Cryptographic Audit Agent", role: "Appends SHA-256 block hash-chain records to ledger", state: "PROCESSING", tasks: "310,400", latency: "4ms", memory: "15MB" },
        { name: "Secret & PII Redactor", role: "Deterministic regex & heuristic scrubbing of keys/PII", state: "PROCESSING", tasks: "520,000", latency: "3ms", memory: "12MB" },
        { name: "Source Trust Decayer", role: "Recalibrates source reliability ratings over time", state: "IDLE", tasks: "18,200", latency: "20ms", memory: "18MB" },
        { name: "Model Bias & Safety Guard", role: "Evaluates LLM reasoning traces for safety violations", state: "PROCESSING", tasks: "94,100", latency: "35ms", memory: "45MB" },
        { name: "SLA & Degradation Supervisor", role: "Monitors probe uptime and triggers graceful degradation", state: "PROCESSING", tasks: "1,200,000", latency: "2ms", memory: "9MB" },
      ],
    },
  ];

  const currentCluster = clusters.find((c) => c.id === activeCluster) || clusters[0];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>Autonomous Multi-Agent Mesh</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              The 28-Agent Autonomous Cluster Fleet
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Coordinated mesh of 28 specialized agents partitioned across 5 functional clusters, communicating over NATS JetStream with tri-tier memory architecture.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-emerald-300 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              28 / 28 Agents Online
            </span>
          </div>
        </div>

        {/* Cluster Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {clusters.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCluster(c.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeCluster === c.id
                  ? "bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-950/50"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[10px] uppercase text-indigo-400 font-mono">Cluster 0{c.id}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                  {c.count} Agents
                </span>
              </div>
              <div className="text-xs font-bold text-white mt-1 truncate">{c.name}</div>
            </button>
          ))}
        </div>

        {/* Active Cluster Details */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              {currentCluster.name}
            </h2>
            <span className="text-xs text-slate-400 font-mono">Cluster ID: CL-{currentCluster.id}</span>
          </div>
          <p className="text-xs text-slate-400">{currentCluster.description}</p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCluster.agents.map((agent, i) => (
            <div
              key={i}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">AGENT-{currentCluster.id}0{i + 1}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    agent.state === "PROCESSING"
                      ? "bg-indigo-950 text-indigo-300 border border-indigo-800 animate-pulse"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {agent.state}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">{agent.role}</p>

              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-1.5 rounded bg-[#0a0e18] border border-slate-800/80">
                  <span className="text-[9px] text-slate-500 uppercase block">Tasks</span>
                  <span className="font-mono font-semibold text-slate-200 text-[11px]">{agent.tasks}</span>
                </div>
                <div className="p-1.5 rounded bg-[#0a0e18] border border-slate-800/80">
                  <span className="text-[9px] text-slate-500 uppercase block">Latency</span>
                  <span className="font-mono font-semibold text-emerald-400 text-[11px]">{agent.latency}</span>
                </div>
                <div className="p-1.5 rounded bg-[#0a0e18] border border-slate-800/80">
                  <span className="text-[9px] text-slate-500 uppercase block">Memory</span>
                  <span className="font-mono font-semibold text-slate-200 text-[11px]">{agent.memory}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tri-Tier Memory Architecture Documentation */}
        <div className="p-5 rounded-xl bg-[#0a0e18] border border-slate-800 text-xs space-y-3">
          <span className="font-semibold text-indigo-400 uppercase tracking-wider block">
            Tri-Tier Memory Topology for Autonomous Agents
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-1">1. Working Context</strong>
              <p className="text-slate-400 text-[11px]">
                In-memory scratchpad bounding the active task cycle. Cleared immediately upon task completion to prevent state bleed.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-1">2. Episodic Session Memory</strong>
              <p className="text-slate-400 text-[11px]">
                Redis-backed TTL storage retaining recent cross-agent interaction traces, intermediate claims, and deduplication tokens.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-1">3. Semantic LPKG Graph</strong>
              <p className="text-slate-400 text-[11px]">
                Long-term persistent knowledge graph stored in PostgreSQL pgvector with temporal validity intervals and evidence citations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
