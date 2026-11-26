"use client";

import React, { useState } from "react";
import { AppShell } from "../components/AppShell";
import {
  Settings,
  Building2,
  Users,
  Radio,
  Key,
  Shield,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"org" | "members" | "sources" | "apikeys">("org");

  const members = [
    { id: "m-1", name: "Alice Vance", email: "alice@acme.com", role: "Owner", joined: "2026-01-10" },
    { id: "m-2", name: "Bob Martinez", email: "bob@acme.com", role: "Admin", joined: "2026-02-14" },
    { id: "m-3", name: "Carol Chen", email: "carol@acme.com", role: "Engineer", joined: "2026-04-01" },
    { id: "m-4", name: "David Kim", email: "david@acme.com", role: "Analyst", joined: "2026-05-19" },
  ];

  const sources = [
    { id: "src-1", name: "Node.js Core Releases", type: "GitHub Releases", trustTier: "Tier 1 (Official)", status: "Active", lastPolled: "3 mins ago" },
    { id: "src-2", name: "IETF Datatracker RFC Feed", type: "Standards RSS", trustTier: "Tier 1 (Official)", status: "Active", lastPolled: "12 mins ago" },
    { id: "src-3", name: "NIST National Vulnerability Database", type: "Security API", trustTier: "Tier 1 (Official)", status: "Active", lastPolled: "1 min ago" },
    { id: "src-4", name: "W3C Web Architecture WG", type: "Working Group Spec", trustTier: "Tier 1 (Official)", status: "Active", lastPolled: "1 hour ago" },
    { id: "src-5", name: "Hacker News Technical Discourse", type: "Community Aggregator", trustTier: "Tier 3 (Community)", status: "Filtered", lastPolled: "5 mins ago" },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Settings className="w-4 h-4" />
              <span>Workspace Administration</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Organization, Access & Ingestion Feeds
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Configure multi-tenant boundaries, manage role-based access permissions, and maintain trustworthy knowledge ingestion sources.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 font-mono">
              Tenant ID: 8e682661-900e-4896-a049
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
          {[
            { id: "org", label: "Organization Profile", icon: Building2 },
            { id: "members", label: "Members & RBAC", icon: Users },
            { id: "sources", label: "Ingestion Feeds", icon: Radio },
            { id: "apikeys", label: "API Keys & Integrations", icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Organization Profile */}
        {activeTab === "org" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6 max-w-3xl">
            <h2 className="text-base font-bold text-white">Organization Profile</h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Organization Name</label>
                <input
                  type="text"
                  defaultValue="Acme Corp Engineering"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Canonical Slug</label>
                <input
                  type="text"
                  defaultValue="acme-corp"
                  disabled
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Knowledge Vertical Domain</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500">
                  <option>Full-Stack Web Development (Kenora Developer)</option>
                  <option>Cloud Infrastructure & Distributed Systems</option>
                  <option>AI Ecosystem & Foundation Model Research</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => alert("Organization profile saved successfully.")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Members & RBAC */}
        {activeTab === "members" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Team Members & Access Control</h2>
                <p className="text-xs text-slate-400">Strictly enforced via PermissionsGuard and RolePermissionMatrix.</p>
              </div>
              <button
                onClick={() => alert("Invite link generated.")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Invite Member</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Joined Date</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{m.name}</div>
                        <div className="text-slate-500 text-[11px] font-mono">{m.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            m.role === "Owner"
                              ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                              : m.role === "Admin"
                              ? "bg-purple-950 text-purple-300 border border-purple-800"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{m.joined}</td>
                      <td className="py-3 px-3 text-right">
                        {m.role !== "Owner" && (
                          <button
                            onClick={() => alert(`Removed ${m.name}`)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Ingestion Sources */}
        {activeTab === "sources" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Ingestion Feeds & Source Adapters</h2>
                <p className="text-xs text-slate-400">Sources undergo Bayesian corroboration; noise is discarded by ANI.</p>
              </div>
              <button
                onClick={() => alert("Add Source modal opened.")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source Feed</span>
              </button>
            </div>

            <div className="space-y-3">
              {sources.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Radio className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">{s.name}</span>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{s.type}</span>
                        <span>·</span>
                        <span className="text-indigo-400">{s.trustTier}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">Polled {s.lastPolled}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold text-[10px]">
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: API Keys */}
        {activeTab === "apikeys" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4 max-w-3xl">
            <h2 className="text-base font-bold text-white">Platform API Access Keys</h2>
            <p className="text-xs text-slate-400">
              Authenticate requests to the NestJS API with Bearer session keys or enterprise machine-to-machine tokens.
            </p>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Production Machine Key</span>
                <span className="text-emerald-400 text-[10px] font-bold uppercase">Active</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 select-all">
                kenora_live_94821a78b54c829e01df34bb992841
              </div>
              <span className="text-[10px] text-slate-500 block">Created 2026-02-01 · Scopes: knowledge:read, knowledge:verify, metrics:read</span>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
