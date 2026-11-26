"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Network,
  ShieldCheck,
  Cpu,
  Bot,
  Activity,
  FileCheck2,
  Settings,
  ExternalLink,
  ChevronDown,
  Building2,
  Sparkles,
  Zap,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [currentOrg, setCurrentOrg] = useState("Acme Corp Engineering");
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

  const navItems = [
    {
      label: "Overview",
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Daily Intelligence",
      href: "/daily",
      icon: Calendar,
      badge: "9 Questions",
    },
    {
      label: "Knowledge Graph",
      href: "/lpkg",
      icon: Network,
      badge: "LPKG",
    },
    {
      label: "Fact Verification",
      href: "/verification",
      icon: ShieldCheck,
      badge: "MSVF",
    },
    {
      label: "AI Benchmarks",
      href: "/benchmarks",
      icon: Cpu,
      badge: "Dual-Run",
    },
    {
      label: "28-Agent Fleet",
      href: "/agents",
      icon: Bot,
      badge: "5 Clusters",
    },
    {
      label: "Observability & SLA",
      href: "/observability",
      icon: Activity,
      badge: "99.99%",
    },
    {
      label: "Cryptographic Audit",
      href: "/audit",
      icon: FileCheck2,
      badge: "SHA-256",
    },
    {
      label: "Settings & Sources",
      href: "/settings",
      icon: Settings,
      badge: null,
    },
  ];

  const organizations = [
    { id: "org-1", name: "Acme Corp Engineering", role: "Owner" },
    { id: "org-2", name: "Kenora Core Research Labs", role: "Admin" },
    { id: "org-3", name: "Autonomous Systems AI", role: "Analyst" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#0b0f19] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-[#0d1322] flex flex-col fixed inset-y-0 z-40">
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
              K
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">KENORA</span>
              <span className="block text-[10px] text-indigo-400 font-medium tracking-wider uppercase">
                Knowledge Layer
              </span>
            </div>
          </Link>
          <span className="text-[10px] bg-indigo-950 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-800/60">
            v3.0
          </span>
        </div>

        {/* Tenant Organization Switcher */}
        <div className="p-3 border-b border-slate-800/60">
          <div className="relative">
            <button
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{currentOrg}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {isOrgDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-400">
                  Switch Active Tenant
                </div>
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      setCurrentOrg(org.name);
                      setIsOrgDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-indigo-600/20 transition-colors ${
                      currentOrg === org.name ? "text-indigo-400 font-semibold bg-indigo-950/40" : "text-slate-300"
                    }`}
                  >
                    <span className="truncate">{org.name}</span>
                    <span className="text-[10px] text-slate-500">{org.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                      isActive
                        ? "bg-indigo-700 text-indigo-100"
                        : "bg-slate-800 text-slate-400 border border-slate-700/60"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Health Indicators */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0a0e17] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SLA Availability
            </span>
            <span className="font-semibold text-emerald-400">100.0%</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-indigo-400" />
              Degradation State
            </span>
            <span className="text-indigo-400 font-semibold text-[10px]">NORMAL</span>
          </div>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Audit Chain Tip</span>
            <span className="font-mono text-[9px] text-slate-400 truncate max-w-[90px]">#0024 · Verified</span>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col pl-64">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-[#0d1322]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Knowledge Intelligence Layer
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-xs text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Living Professional Knowledge Infrastructure
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:4000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              <span>Swagger API Docs</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-indigo-400">
              KP
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
