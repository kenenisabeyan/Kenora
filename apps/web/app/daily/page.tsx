"use client";

import React, { useState } from "react";
import { AppShell } from "../components/AppShell";
import {
  Calendar,
  ShieldAlert,
  Sparkles,
  GitPullRequest,
  CheckCircle2,
  Clock,
  Layers,
  Scale,
  MessageSquare,
  Wrench,
  Download,
  Filter,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function DailyIntelligencePage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);

  const questions = [
    {
      num: 1,
      title: "What broke or changed in core frameworks and runtimes?",
      icon: GitPullRequest,
      status: "Verified",
      confidence: 98,
      severity: "High",
      category: "Runtime & Frameworks",
      summary:
        "Node.js v24 finalized ESM loader flags and made native compile-cache enabled by default. Legacy CommonJS require hooks trigger strict deprecation warnings in strict mode.",
      evidence: [
        { source: "Node.js Core Release v24.0.0", url: "https://nodejs.org/en/blog/release/v24.0.0", tier: "Tier 1 Official" },
        { source: "V8 Engine Commit 94821a", url: "https://chromium.googlesource.com/v8/v8", tier: "Tier 1 Primary" },
      ],
      recommendation:
        "Audit serverless cold-start scripts to ensure require() patching is replaced with node:module register hooks.",
    },
    {
      num: 2,
      title: "What new critical security advisories or CVEs were disclosed?",
      icon: ShieldAlert,
      status: "Advisory Active",
      confidence: 99,
      severity: "Critical",
      category: "Security & Vulnerabilities",
      summary:
        "CVE-2026-4412: High-concurrency TLS handshake buffer overrun disclosed affecting unpatched HTTP/2 proxies. CVSS 9.8.",
      evidence: [
        { source: "NIST National Vulnerability Database", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-4412", tier: "Tier 1 National Authority" },
        { source: "OpenSSF Security Advisory Board", url: "https://openssf.org/advisories", tier: "Tier 1 Consortium" },
      ],
      recommendation:
        "Upgrade ingress reverse proxy containers to v2.14.2+ immediately; deploy edge rate-limiting on initial client hello frames.",
    },
    {
      num: 3,
      title: "What architectural paradigms or design patterns shifted?",
      icon: Layers,
      status: "Consensus Formed",
      confidence: 95,
      severity: "Medium",
      category: "Architecture",
      summary:
        "Shift from client-heavy Single Page Applications (SPAs) toward partial prerendering and streaming React Server Components (RSC) is documented across 74% of enterprise migrations.",
      evidence: [
        { source: "W3C Web Performance Working Group Report", url: "https://www.w3.org/webperf/", tier: "Tier 1 Standards Body" },
        { source: "State of Web Architecture 2026", url: "https://almanac.httparchive.org", tier: "Tier 2 Empirical Telemetry" },
      ],
      recommendation:
        "Adopt async server boundaries to isolate data fetching from client hydration bundles.",
    },
    {
      num: 4,
      title: "What benchmark claims were reproduced vs refuted?",
      icon: Sparkles,
      status: "Dual-Verified",
      confidence: 96,
      severity: "Informational",
      category: "AI & Benchmarks",
      summary:
        "Frontier Reasoner v3 claimed 58.4% on SWE-bench Verified. Dual independent reproduction across Stanford CRFM and Kenora Labs confirmed 58.2% (Δ -0.34%, well within margin).",
      evidence: [
        { source: "Kenora Dual-Reproduction Harness Run #1142", url: "/benchmarks", tier: "Tier 1 Independent Lab" },
        { source: "Berkeley BAIR SWE-bench Reproduction Suite", url: "https://bair.berkeley.edu", tier: "Tier 1 Academic" },
      ],
      recommendation:
        "Safe to adopt for automated PR verification tasks; budget token consumption at $0.004 per 1k input tokens.",
    },
    {
      num: 5,
      title: "What deprecation cycles are entering critical phases?",
      icon: Clock,
      status: "Action Required",
      confidence: 100,
      severity: "High",
      category: "Lifecycle & Governance",
      summary:
        "Node.js 18 reaches absolute End-of-Life (EOL) in 45 days. Security patches and CVE backports will terminate completely.",
      evidence: [
        { source: "Node.js Release Schedule WG", url: "https://github.com/nodejs/release#release-schedule", tier: "Tier 1 Governance" },
      ],
      recommendation:
        "Prioritize upgrading remaining legacy container base images to Node.js 22 LTS or 24 LTS.",
    },
    {
      num: 6,
      title: "What developer tooling ecosystems reached production maturity?",
      icon: Wrench,
      status: "Production Ready",
      confidence: 94,
      severity: "Medium",
      category: "Developer Tooling",
      summary:
        "Turbopack native compilation engine achieved 100% test compatibility with Webpack plugins, demonstrating 4.2x faster cold builds.",
      evidence: [
        { source: "Vercel Engineering Architecture Brief", url: "https://vercel.com/blog", tier: "Tier 2 Vendor Spec" },
        { source: "Independent Enterprise Benchmark Telemetry", url: "#", tier: "Tier 2 Lab Verified" },
      ],
      recommendation:
        "Enable turbopack flag on standard development pipelines for immediate iteration speedup.",
    },
    {
      num: 7,
      title: "What regulatory, compliance, or licensing shifts occurred?",
      icon: Scale,
      status: "Policy Enacted",
      confidence: 97,
      severity: "High",
      category: "Compliance & Legal",
      summary:
        "EU AI Act Article 52 high-risk classification requirements apply to code generation agents operating in critical infrastructure software.",
      evidence: [
        { source: "Official Journal of the European Union L 2024/1689", url: "https://eur-lex.europa.eu", tier: "Tier 1 Statutory" },
      ],
      recommendation:
        "Ensure all AI-assisted code commits maintain immutable human reviewer attestation records.",
    },
    {
      num: 8,
      title: "What community debates reached consensus vs remaining contested?",
      icon: MessageSquare,
      status: "Contested Discourse",
      confidence: 88,
      severity: "Low",
      category: "Ecosystem Discourse",
      summary:
        "Debate over ORM overhead vs raw SQL query builders continues. Consensus is established: compile-time type-safe query builders (like Drizzle) dominate greenfield services, while traditional ORMs remain preferred for rapid prototyping.",
      evidence: [
        { source: "GitHub Discussions RFC #4921", url: "https://github.com", tier: "Tier 3 Community" },
        { source: "Hacker News Technical Consensus Digest", url: "https://news.ycombinator.com", tier: "Tier 3 Community" },
      ],
      recommendation:
        "Standardize on Drizzle ORM for serverless edge contexts due to zero-runtime overhead.",
    },
    {
      num: 9,
      title: "What actionable recommendations apply to our engineering stack today?",
      icon: TrendingUp,
      status: "Executive Directive",
      confidence: 99,
      severity: "High",
      category: "Actionable Strategy",
      summary:
        "Top 3 directives for today: 1) Deploy TLS patch for CVE-2026-4412, 2) Set target upgrade window for Node 18 EOL services, 3) Review model gateway cost limits.",
      evidence: [
        { source: "Kenora Bayesian Knowledge Synthesizer", url: "#", tier: "Tier 1 Kenora Intelligence Kernel" },
      ],
      recommendation:
        "Schedule 15-minute engineering standup alignment on the 3 critical directives.",
    },
  ];

  const filteredQuestions =
    selectedFilter === "all"
      ? questions
      : questions.filter((q) =>
          selectedFilter === "security"
            ? q.category.includes("Security")
            : selectedFilter === "runtime"
            ? q.category.includes("Runtime") || q.category.includes("Architecture")
            : selectedFilter === "ai"
            ? q.category.includes("AI")
            : true
        );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Daily Intelligence Briefing · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              The 9-Question Decision Matrix
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Synthesized by the 28-Agent Delivery Cluster. Evaluates multi-source evidence, verifies empirical claims, and eliminates unverified cognitive churn.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Daily Briefing exported as Markdown to clipboard.")}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Briefing</span>
            </button>
            <button
              onClick={() => alert("Triggering 28-Agent Ingestion & Bayesian Synthesis Cycle.")}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-medium text-white rounded-lg shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Re-Synthesize</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filter Domain:
          </span>
          {[
            { id: "all", label: "All 9 Questions" },
            { id: "security", label: "Security & CVEs" },
            { id: "runtime", label: "Runtime & Frameworks" },
            { id: "ai", label: "AI & Benchmarks" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFilter === tab.id
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Questions Accordion / List */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const Icon = q.icon;
            const isExpanded = expandedQuestion === q.num;

            return (
              <div
                key={q.num}
                className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-700"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.num)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center shrink-0 text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-indigo-400 font-semibold">Q0{q.num}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400 font-medium">{q.category}</span>
                        <span className="text-slate-600">·</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            q.severity === "Critical"
                              ? "bg-rose-950 text-rose-300 border border-rose-800"
                              : q.severity === "High"
                              ? "bg-amber-950 text-amber-300 border border-amber-800"
                              : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold text-white mt-1 hover:text-indigo-300 transition-colors">
                        {q.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Confidence</span>
                      <span className="text-xs font-semibold text-emerald-400">{q.confidence}%</span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-90 text-indigo-400" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-[#0a0e18] space-y-4">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Synthesized Finding
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                        {q.summary}
                      </p>
                    </div>

                    {/* Primary Evidence Chain */}
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Traceable Primary Evidence Sources
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.evidence.map((ev, i) => (
                          <a
                            key={i}
                            href={ev.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                          >
                            <span className="truncate pr-2">{ev.source}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800/60">
                                {ev.tier}
                              </span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Actionable Engineering Recommendation */}
                    <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-lg p-3.5">
                      <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block mb-1">
                        Actionable Engineering Recommendation
                      </span>
                      <p className="text-xs text-slate-300">{q.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
