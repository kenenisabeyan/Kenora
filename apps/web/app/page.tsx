"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "./components/AppShell";
import {
  Calendar,
  Network,
  ShieldCheck,
  Cpu,
  Bot,
  Activity,
  FileCheck2,
  Settings,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Layers,
  Zap,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default function KenoraOverviewPage() {
  const kpis = [
    { label: "Verified Claims", value: "18,490", delta: "+142 today", icon: ShieldCheck, color: "emerald" },
    { label: "LPKG Graph Entities", value: "4,120", delta: "+38 paradigms", icon: Network, color: "indigo" },
    { label: "Dual-Verified Benchmarks", value: "91.4%", delta: "64 models tracked", icon: Cpu, color: "blue" },
    { label: "Autonomous Agent Fleet", value: "28 / 28", delta: "5 active clusters", icon: Bot, color: "purple" },
  ];

  const sections = [
    {
      title: "Daily 9-Question Intelligence Matrix",
      desc: "Synthesizes today's breaking changes, CVE advisories, paradigm shifts, deprecations, and actionable recommendations.",
      href: "/daily",
      icon: Calendar,
      tag: "Daily Briefing",
      status: "Fresh Today",
    },
    {
      title: "Living Knowledge Graph (LPKG)",
      desc: "Temporal entity relations, supersession justifications, and evolution timeline milestones.",
      href: "/lpkg",
      icon: Network,
      tag: "Knowledge Layer",
      status: "Active Graph",
    },
    {
      title: "Multi-Source Verification (MSVF)",
      desc: "Bayesian corroboration workbench, evidence source weighting, and three-step precedence adjudication.",
      href: "/verification",
      icon: ShieldCheck,
      tag: "Fact Verification",
      status: "Bayesian Kernel",
    },
    {
      title: "AI Ecosystem Intelligence",
      desc: "Independent dual-reproduction benchmark tracking, vendor claim verification, and tokens/$/watt efficiency.",
      href: "/benchmarks",
      icon: Cpu,
      tag: "AI Telemetry",
      status: "Dual-Reproduction",
    },
    {
      title: "28-Agent Cluster Fleet",
      desc: "Monitor acquisition, understanding, verification, delivery, and governance agent workloads over NATS.",
      href: "/agents",
      icon: Bot,
      tag: "Multi-Agent Mesh",
      status: "100% Online",
    },
    {
      title: "Observability & SLA Tracker",
      desc: "Nanosecond latency histograms, rolling 99.99% SLA availability, circuit breakers, and degradation modes.",
      href: "/observability",
      icon: Activity,
      tag: "Zero Downtime",
      status: "99.99% Target",
    },
    {
      title: "Cryptographic Audit Ledger",
      desc: "Immutable SHA-256 block hash-chain explorer with live tamper verification and automated secret redactor.",
      href: "/audit",
      icon: FileCheck2,
      tag: "SOC 2 Compliance",
      status: "Chain Valid",
    },
    {
      title: "Workspace Administration",
      desc: "Multi-tenant tenant settings, role-based access control (RBAC), and source adapter feeds.",
      href: "/settings",
      icon: Settings,
      tag: "Governance",
      status: "RBAC Enforced",
    },
  ];

  const latestIntelligence = [
    {
      id: "intel-1",
      title: "RFC 9114 HTTP/3 Formal Specification Finalized",
      category: "Networking / Protocol",
      tier: "Tier 1 Official RFC",
      confidence: 99,
      summary: "IETF finalizes HTTP/3 over QUIC transport. Mandates multiplexed UDP streams and eliminates head-of-line blocking.",
      url: "https://datatracker.ietf.org/doc/rfc9114/",
    },
    {
      id: "intel-2",
      title: "CVE-2026-4412 Critical Transport Handshake Vulnerability",
      category: "Security / Advisory",
      tier: "Tier 1 NIST NVD",
      confidence: 98,
      summary: "Buffer overrun in legacy TLS extension handling. CVSS 9.8. Reverse proxy containers require immediate v2.14.2+ update.",
      url: "https://nvd.nist.gov/vuln/detail/CVE-2026-4412",
    },
    {
      id: "intel-3",
      title: "Node.js v24 Native Compile Cache & Default ESM Standard",
      category: "Runtime Architecture",
      tier: "Tier 1 Release WG",
      confidence: 96,
      summary: "Native compile cache enabled by default. Legacy CommonJS require hooks trigger strict deprecation notices.",
      url: "https://nodejs.org/en/blog/release/v24.0.0",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700/60 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kenora Architecture & Vision Whitepaper v3.0</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              The AI-Powered Professional Knowledge Infrastructure
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Continuously turns fragmented multi-source web information into verified, connected, actionable professional intelligence—without requiring practitioners to ask.
            </p>
          </div>
        </div>

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-semibold text-slate-400">{kpi.label}</span>
                  <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-900/50 text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{kpi.value}</div>
                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{kpi.delta}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Dashboards Navigation Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Platform Intelligence Dashboards</h2>
              <p className="text-xs text-slate-400">Direct access to all specialized engines, registries, and operational consoles.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.map((sec, i) => {
              const Icon = sec.icon;
              return (
                <Link
                  key={i}
                  href={sec.href}
                  className="group p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/70 hover:bg-slate-900 transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700/60">
                        {sec.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {sec.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                        {sec.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Latest Verified Intelligence Stream */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Latest Primary Verified Intelligence
              </h2>
              <p className="text-xs text-slate-400">Traceable primary evidence chains scored by MSVF.</p>
            </div>
            <Link
              href="/daily"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View 9-Question Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {latestIntelligence.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{item.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {item.tier}
                    </span>
                  </div>
                  <p className="text-slate-400">{item.summary}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Confidence</span>
                    <span className="font-bold text-emerald-400">{item.confidence}%</span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
