"use client";

import React, { useState } from "react";
import { AppShell } from "../components/AppShell";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Server,
  Clock,
  BarChart3,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function ObservabilityPage() {
  const [degradationState, setDegradationState] = useState<
    "NORMAL_OPERATION" | "DEGRADED_FALLBACK" | "EMERGENCY_READ_ONLY"
  >("NORMAL_OPERATION");

  const metrics = [
    { name: "Total Requests Processed", value: "1,492,840", delta: "+12.4% / 24h", status: "Healthy" },
    { name: "p50 Response Latency", value: "8.4 ms", delta: "-1.2 ms vs baseline", status: "Optimal" },
    { name: "p95 Response Latency", value: "19.2 ms", delta: "< 25ms SLA budget", status: "Optimal" },
    { name: "p99 Response Latency", value: "34.1 ms", delta: "< 50ms SLA budget", status: "Optimal" },
  ];

  const circuitBreakers = [
    { service: "PostgreSQL Database Pool", state: "CLOSED", failures: 0, maxAllowed: 5, threshold: "Healthy" },
    { service: "Redis Cluster Connector", state: "CLOSED", failures: 0, maxAllowed: 5, threshold: "Healthy" },
    { service: "NATS JetStream Mesh", state: "CLOSED", failures: 0, maxAllowed: 3, threshold: "Healthy" },
    { service: "ModelGateway (OpenAI/Anthropic)", state: "CLOSED", failures: 1, maxAllowed: 5, threshold: "Transient Rate-Limit (Recovered)" },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Observability, Telemetry & Resilience</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Prometheus Metrics & 99.99% SLA Tracker
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              High-resolution nanosecond latency histograms, rolling SLA error-budget monitoring, distributed circuit breakers, and 3-state graceful degradation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://localhost:4000/api/v1/metrics"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 rounded-lg transition-colors"
            >
              <span>Prometheus /metrics</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* SLA Status Card */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs uppercase font-semibold text-emerald-400 flex items-center justify-center md:justify-start gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Enterprise Availability SLA: 99.99%
            </span>
            <div className="text-4xl font-black text-white">100.00% Operational Uptime</div>
            <p className="text-xs text-slate-400">
              Zero downtime in current 30-day rolling window. Max allowed downtime budget: 4.32 minutes / month.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg min-w-[130px]">
              <span className="text-[10px] text-slate-500 uppercase block">Error Budget Left</span>
              <span className="text-base font-bold text-emerald-400">100.0%</span>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg min-w-[130px]">
              <span className="text-[10px] text-slate-500 uppercase block">Outage Events</span>
              <span className="text-base font-bold text-slate-300">0</span>
            </div>
          </div>
        </div>

        {/* Nanosecond Latency Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs uppercase font-semibold">{m.name}</span>
              <div className="text-2xl font-bold text-white">{m.value}</div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-500">{m.delta}</span>
                <span className="text-emerald-400 font-semibold">{m.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Graceful Degradation Manager */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                Graceful Degradation Circuit Manager
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Controls service shedding under extreme upstream load or partial provider outages.
              </p>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                degradationState === "NORMAL_OPERATION"
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : degradationState === "DEGRADED_FALLBACK"
                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                  : "bg-rose-950 text-rose-300 border border-rose-800"
              }`}
            >
              {degradationState}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {[
              {
                id: "NORMAL_OPERATION",
                label: "Normal Operation",
                desc: "All services fully active: real-time LLM inference, continuous ingestion, background workers.",
              },
              {
                id: "DEGRADED_FALLBACK",
                label: "Degraded Fallback",
                desc: "Non-critical ingestion paused; serves cached LPKG graph and cached search results.",
              },
              {
                id: "EMERGENCY_READ_ONLY",
                label: "Emergency Read-Only",
                desc: "All mutations disabled; database switched to read-only replica to protect state.",
              },
            ].map((state) => (
              <button
                key={state.id}
                onClick={() => setDegradationState(state.id as any)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  degradationState === state.id
                    ? "bg-indigo-950/40 border-indigo-500 shadow-md"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <div className="font-semibold text-xs text-white mb-1">{state.label}</div>
                <p className="text-[11px] text-slate-400">{state.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Distributed Circuit Breakers Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              Distributed Circuit Breaker Fleet
            </h2>
            <span className="text-xs text-slate-500 font-mono">Automated Failure Tripping & Backoff</span>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {circuitBreakers.map((cb, i) => (
              <div key={i} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{cb.service}</span>
                    <span className="text-[11px] text-slate-500 block">{cb.threshold}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-400 text-[11px]">Failures: {cb.failures}/{cb.maxAllowed}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold text-[10px]">
                    {cb.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
