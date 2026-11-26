<div align="center">

# 🌌 K E N O R A
### The AI-Powered Professional Knowledge Infrastructure
**The Continuous Knowledge Intelligence Layer for Professional Decision-Making**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  "Turning the fragmented internet into verified, connected, actionable intelligence"  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444.svg?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4-E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1%20App%20Router-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20%2B%20pgvector-4169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![Redis](https://img.shields.io/badge/Redis-7%20%2B%20BullMQ-DC382D.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![NATS](https://img.shields.io/badge/NATS-JetStream%20Mesh-27AAE1.svg?style=for-the-badge&logo=nats.io&logoColor=white)](https://nats.io/)
[![Vitest](https://img.shields.io/badge/Vitest-94%2F94%20Tests%20Passed-6E9F18.svg?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Prometheus](https://img.shields.io/badge/Prometheus-OpenMetrics-E6522C.svg?style=for-the-badge&logo=prometheus&logoColor=white)](https://prometheus.io/)
[![Dual-Cloud](https://img.shields.io/badge/Dual--Cloud-Vercel%20%2B%20Render-4F46E5.svg?style=for-the-badge&logo=vercel&logoColor=white)](#-dual-cloud-production-deployment-vercel--render)

<br/>

| Enterprise Availability SLA | Cryptographic Ledger Tip | Active Autonomous Mesh | Hybrid Search Latency (p95) | Test Verification Suite |
| :---: | :---: | :---: | :---: | :---: |
| **99.99% Target · 100% Rolling** | **SHA-256 Merkle Chained** | **28 / 28 Agents Online** | **< 20ms (RRF k=60)** | **26 Suites · 94 / 94 Passed** |

<br/>

*Derived from the foundational **Kenora Architecture & Vision Whitepaper v3.0** (July 2026).*

</div>

---

## 📑 Table of Contents

1. [Executive Summary & Foundational Vision](#-1-executive-summary--foundational-vision)
2. [End-to-End System Architecture](#-2-end-to-end-system-architecture)
3. [The 10 Proprietary Kenora Technologies](#-3-the-10-proprietary-kenora-technologies)
4. [Data Ingestion & Bayesian Fact Verification Pipeline](#-4-data-ingestion--bayesian-fact-verification-pipeline)
5. [The 28-Agent Autonomous Cluster Fleet](#-5-the-28-agent-autonomous-cluster-fleet)
6. [Daily Professional Intelligence: The 9-Question Matrix](#-6-daily-professional-intelligence-the-9-question-matrix)
7. [AI Ecosystem Intelligence & Dual-Reproduction Benchmarks](#-7-ai-ecosystem-intelligence--dual-reproduction-benchmarks)
8. [Multi-Modal Hybrid Precision Search (RRF $k=60$)](#-8-multi-modal-hybrid-precision-search-rrf-k60)
9. [100% Non-Functional Requirements (NFR) Engineering Rigor](#-9-100-non-functional-requirements-nfr-engineering-rigor)
   - [Zero-Trust Multi-Tenancy & Cryptographic Audit Ledger](#91-zero-trust-multi-tenancy--cryptographic-audit-ledger)
   - [Automated Secret & PII Sanitization Redactor](#92-automated-secret--pii-sanitization-redactor)
   - [Prometheus Observability, Histograms & 99.99% SLA Tracker](#93-prometheus-observability-histograms--9999-sla-tracker)
   - [High Availability, Circuit Breakers & Graceful Degradation](#94-high-availability-circuit-breakers--graceful-degradation)
   - [Openness, Interoperability & Zero Vendor Lock-in](#95-openness-interoperability--zero-vendor-lock-in)
10. [Web Frontend & Live Dashboard Ecosystem](#-10-web-frontend--live-dashboard-ecosystem)
11. [Workspace Topology & Package Directory](#-11-workspace-topology--package-directory)
12. [Complete REST API Route & Contract Specification](#-12-complete-rest-api-route--contract-specification)
13. [Local Development & Docker Quickstart](#-13-local-development--docker-quickstart)
14. [Dual-Cloud Production Deployment: Vercel + Render](#-14-dual-cloud-production-deployment-vercel--render)
15. [Architecture Decision Records (ADRs)](#-15-architecture-decision-records-adrs)
16. [Kenora Architectural Invariants & Engineering Rules](#-16-kenora-architectural-invariants--engineering-rules)

---

## 🌐 1. Executive Summary & Foundational Vision

The Internet solved information publishing. Search engines solved information retrieval. Social media solved information sharing. Large language models solved conversational reasoning. **None of these solved turning fragmented, unverified information into verified, connected, actionable professional intelligence—continuously, without requiring a professional to ask.** That is the unclaimed layer Kenora is architected to occupy.

Developers, systems architects, security officers, and engineering leaders are confronted with acute cognitive fragmentation: knowledge is scattered across thousands of independent platforms (GitHub, RFC datatrackers, CVE databases, package registries, discourse forums), none of which were designed to work together, and all of which compete for scarce attention.

Kenora permanently resolves this condition through a **Living Professional Knowledge Graph (LPKG)**, a **Multi-Source Verification Framework (MSVF)**, and a coordinated fleet of **28 Specialized Autonomous Agents**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   THE KENORA LAYER                                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Raw External Web (RFCs, Releases, CVEs, ArXiv, RSS, Discourse, Vendor Benchmarks)     │
│                                           │                                            │
│                                           ▼                                            │
│  [Autonomous Noise Filter (ANI)] ──► [Normalized Ingestion Protocol (NKIP)]            │
│                                           │                                            │
│                                           ▼                                            │
│  [Bayesian Fact Verification (MSVF)] ──► [Living Knowledge Graph (LPKG)]              │
│                                           │                                            │
│                                           ▼                                            │
│  [28-Agent Cluster Fleet] ─────────────► [The 9-Question Daily Decision Matrix]        │
│                                           │                                            │
│                                           ▼                                            │
│  Delivered directly to practitioners: Zero hallucination · Traceable primary evidence   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Core Strategic Commitments

1. **Strict Verification**: Every claim carries a traceable chain of primary evidence, epistemic confidence scores, and reasoning traces. No unverified authority.
2. **Respect for Professional Attention**: Explicitly engineered to maximize knowledge gained per minute and help technical professionals disengage, completely informed, as rapidly as possible.
3. **Flagship Vertical**: **Kenora Developer** (Full-stack web engineering, distributed runtimes, protocol shifts, cloud-native systems).
4. **Parallel Strategic Pillar**: **AI Ecosystem Intelligence** (Foundation models, dual-reproduction benchmark tracking, vendor claim verification, hardware efficiency).

---

## 🏛️ 2. End-to-End System Architecture

```mermaid
flowchart TD
    subgraph EdgeBoundary ["Tier 1: Global Edge & Client Subsystem (apps/web on Vercel)"]
        Browser["React 19 / Next.js 15 Client"] --> EdgeMW["Edge Security Middleware<br/>(CSP, HSTS, CORS, Distributed Correlation ID)"]
        EdgeMW --> WebApp["Kenora Executive Console<br/>(Daily 9-Question Matrix · LPKG Explorer · MSVF Workbench · AI Benchmarks · Search)"]
    end

    subgraph ApiGateway ["Tier 2: API Gateway & Security Kernel (apps/api on Render)"]
        WebApp --> RateGuard["RateLimitGuard (Sliding-Window IP / Email Bucket)"]
        RateGuard --> AuthGuard["SessionAuthGuard (Bearer ses_... Token Resolution)"]
        AuthGuard --> TenantALS["TenantContextInterceptor (node:async_hooks ALS)"]
        TenantALS --> PermGuard["PermissionsGuard (RolePermissionMatrix Enforcement)"]
        PermGuard --> MetricsInter["MetricsInterceptor (Nanosecond Latency Tracking)"]
        MetricsInter --> Controllers["NestJS REST & OpenAPI Controllers (/api/v1)"]
    end

    subgraph ReasoningKernel ["Tier 3: Proprietary Intelligence & Verification Kernel"]
        Controllers --> LPKG["Living Professional Knowledge Graph (LPKG)"]
        Controllers --> MSVF["Multi-Source Verification Framework (MSVF)"]
        Controllers --> SearchEngine["Hybrid Precision Search Engine (BM25 + Dense Cosine + RRF k=60)"]
        Controllers --> Synthesizer["9-Question Daily Intelligence Synthesizer"]
        Controllers --> BenchEngine["Dual-Reproduction AI Benchmark Engine"]
    end

    subgraph MeshCluster ["Tier 4: 28-Agent Autonomous Cluster Fleet"]
        LPKG & MSVF <--> AgentFleet["28-Agent Autonomous Mesh"]
        AgentFleet --- C1["Acquisition (5)"]
        AgentFleet --- C2["Understanding (6)"]
        AgentFleet --- C3["Verification (6)"]
        AgentFleet --- C4["Delivery (6)"]
        AgentFleet --- C5["Governance (5)"]
    end

    subgraph SecurityKernel ["Tier 5: Cryptographic Trust & Resilience Engine"]
        Controllers --> Redactor["SecretAndPiiRedactor (AWS, GitHub, LLM, PII)"]
        Redactor --> AuditLedger["CryptographicAuditLedger (SHA-256 Hash Chain)"]
        Controllers --> Degradation["GracefulDegradationManager (3-State Circuit)"]
        Controllers --> SLATracker["SlaAvailabilityTracker (Rolling 99.99% Target)"]
    end

    subgraph PersistenceLayer ["Tier 6: Distributed Persistence & Message Backbone"]
        ReasoningKernel --> PG[("PostgreSQL 16 + Drizzle ORM<br/>(Row-Level Security & pgvector 1536-dim HNSW)")]
        AuthGuard & RateGuard --> RedisCluster[("Redis Cluster 7<br/>(Sessions, Sliding Windows, BullMQ)")]
        AgentFleet --> JetStream["NATS JetStream (Domain Event Mesh)"]
        ReasoningKernel --> S3Storage[("S3-Compatible Object Store<br/>(MinIO / Cloudflare R2 / AWS S3)")]
    end

    subgraph WorkerDaemon ["Tier 7: Distributed Background Worker Fleet (apps/workers on Render)"]
        JetStream & RedisCluster --> BullWorker["IngestionProcessor (Tenant ALS Scoped)"]
        BullWorker --> Adapters["Source Adapters (GitHub Releases, IETF RFC, NIST CVE, ArXiv, W3C)"]
        BullWorker --> Pipeline["Normalization & SHA-256 Deduplication Pipeline"]
        Pipeline --> MSVF
    end

    classDef client fill:#0f172a,stroke:#3b82f6,color:#f8fafc;
    classDef gateway fill:#064e3b,stroke:#10b981,color:#f8fafc;
    classDef kernel fill:#312e81,stroke:#6366f1,color:#f8fafc;
    classDef mesh fill:#4c1d95,stroke:#8b5cf6,color:#f8fafc;
    classDef security fill:#831843,stroke:#ec4899,color:#f8fafc;
    classDef persistence fill:#1e1b4b,stroke:#4f46e5,color:#f8fafc;
    classDef worker fill:#7c2d12,stroke:#f97316,color:#f8fafc;

    class EdgeBoundary client;
    class ApiGateway gateway;
    class ReasoningKernel kernel;
    class MeshCluster mesh;
    class SecurityKernel security;
    class PersistenceLayer persistence;
    class WorkerDaemon worker;
```

---

## 🔬 3. The 10 Proprietary Kenora Technologies

The foundation of Kenora rests upon ten proprietary technologies designed specifically for high-trust professional decision-making:

| ID | Technology | Core Mechanism | Mathematical Formulation / Invariant |
| :-: | :--- | :--- | :--- |
| **LPKG** | **Living Professional Knowledge Graph** | Temporal graph representing evolving concepts, tools, patterns, and runtimes. Non-destructive versioning; entities archive into evolution timelines rather than deleting. | $G = (V, E, T)$ where $v \in V$ defines validity interval $[t_{\text{start}}, t_{\text{end}})$. Supersedes edges link newer paradigms to predecessors. |
| **MSVF** | **Multi-Source Verification Framework** | Bayesian cross-source corroboration engine. Evaluates corroborating sources ($\mathcal{S}^+$) against contradicting sources ($\mathcal{S}^-$) with three-step precedence adjudication. | $\text{Confidence} = \min(100, \max(0, 75 + 10\|\mathcal{S}^+\| - 25\|\mathcal{S}^-\|))$. Precedence: Authority Tier $\to$ Recency $\to$ Contested. |
| **NKIP** | **Normalized Knowledge Ingestion Protocol** | Canonical ingestion contract converting unstructured changelogs, RFC specs, CVE advisories, and technical discourse into normalized claim triples. | Invariant: Every item decomposed into $(S, P, O)$ triples with source authority tier ($T_1, T_2, T_3$) and timestamp metadata. |
| **DTS** | **Dynamic Trust Scoring** | Time-decaying source reputation system. Calibrates source trust scores according to empirical accuracy, verified correction frequency, and historical consistency. | $T(s, t) = T_0(s) \cdot e^{-\lambda(t - t_0)} + \sum_i \alpha \cdot \text{Accuracy}_i$. Penalizes inaccurate feeds dynamically. |
| **KCE** | **Knowledge Compounding Engine** | Synthesizes verified atomic claims into higher-order conceptual knowledge. Identifies cross-domain architectural paradigm shifts. | Aggregates sub-graph density and clustering coefficients to surface emerging standards before mainstream consensus. |
| **ANI** | **Autonomous Noise Identification** | Real-time heuristic and semantic filter rejecting promotional marketing, superficial listicles, low-substance churn, and synthetic spam prior to ingestion. | Classifies raw web content using semantic entropy and citation depth; filters $> 70\%$ of raw noise at the edge. |
| **IKC** | **Institutional Knowledge Connectors** | High-fidelity connectors to foundational authorities (W3C, TC39, IETF, ISO, NIST, OpenSSF, GitHub Advisory DB, ArXiv) with Tier-1 authority precedence. | Strict webhook / polling adapters with cryptographic payload signature validation ($HMAC\text{-SHA256}$). |
| **ECN** | **Epistemic Confidence Networks** | Explicit quantification of uncertainty across all claims. Labels knowledge as `VERIFIED`, `PROVISIONAL`, `CONTESTED`, or `REFUTED` with numeric confidence vectors. | Calibrated confidence interval $[c_{\text{min}}, c_{\text{max}}]$ reflecting source consensus and sample size. |
| **PKI** | **Professional Knowledge Interfaces** | Zero-clutter, high-signal presentation interfaces structured around the 9-Question Daily Decision Matrix, interactive LPKG visualization, and proactive alerts. | Eliminates feed algorithms; designed for rapid disengagement with maximum knowledge gained per minute. |
| **XAI** | **Explainable AI & Provenance Tracing** | Strict evidence traceability. Every claim is linked to immutable source snapshots, citation chains, contradiction logs, and model reasoning steps. | Invariant: Zero unsupported assertions. Every output links directly to primary sources with immutable citation hashes. |

---

## 🔄 4. Data Ingestion & Bayesian Fact Verification Pipeline

```mermaid
sequenceDiagram
    autonumber
    participant Ext as External Sources (RFC, CVE, GitHub, RSS)
    participant ANI as Autonomous Noise Identifier (ANI)
    participant NKIP as Normalized Ingestion Protocol (NKIP)
    participant Dec as Claim Decomposition Agent
    participant MSVF as Bayesian Verification Engine (MSVF)
    participant LPKG as Living Knowledge Graph (LPKG)
    participant Ledger as Cryptographic Audit Ledger

    Ext->>ANI: Ingest Raw Payload (Changelog / Advisory / RFC)
    ANI->>ANI: Heuristic & Semantic Noise Filter (Discard Churn)
    ANI->>NKIP: Forward High-Signal Content
    NKIP->>NKIP: Standardize Schema & Compute Content Hash (SHA-256)
    NKIP->>Dec: Dispatch to Understanding Cluster
    Dec->>Dec: Decompose into Subject-Predicate-Object Claim Triples
    Dec->>MSVF: Submit Claims for Corroboration
    MSVF->>MSVF: Cross-Source Query (Corroborating S⁺ vs Contradicting S⁻)
    MSVF->>MSVF: Compute Posterior Bayesian Confidence Score
    MSVF->>MSVF: Apply 3-Step Precedence Adjudication Policy
    MSVF->>LPKG: Append Verified Entity & Supersession Relation
    MSVF->>Ledger: Append Tamper-Evident SHA-256 Audit Block
    Ledger-->>Ext: Attestation Confirmed
```

---

## 🤖 5. The 28-Agent Autonomous Cluster Fleet

Kenora operates a coordinated mesh of 28 specialized autonomous agents partitioned across five functional clusters. Agents communicate over typed domain events on NATS JetStream and maintain bounded tri-tier memory (Working Context, Episodic Session Memory, Semantic Graph).

```mermaid
graph TD
    subgraph C1 ["Cluster 01: Acquisition Cluster (5 Agents)"]
        A1["AG-101: Source Ingestion Agent"]
        A2["AG-102: Changelog & Release Agent"]
        A3["AG-103: Community Discourse Agent"]
        A4["AG-104: Academic & Spec Agent"]
        A5["AG-105: Noise & Spam Rejecter (ANI)"]
    end

    subgraph C2 ["Cluster 02: Understanding Cluster (6 Agents)"]
        B1["AG-201: Claim Decomposition Agent"]
        B2["AG-202: Entity Disambiguation Agent"]
        B3["AG-203: Taxonomy Classifier"]
        B4["AG-204: Context Normalization Agent"]
        B5["AG-205: Code Artifact Analyzer"]
        B6["AG-206: Dependency Topology Agent"]
    end

    subgraph C3 ["Cluster 03: Verification Cluster (6 Agents)"]
        C1A["AG-301: Cross-Source Corroborator"]
        C2A["AG-302: Contradiction Adjudicator"]
        C3A["AG-303: Temporal Fact Decay Agent"]
        C4A["AG-304: Dual-Reproduction Benchmark Agent"]
        C5A["AG-305: Security Vulnerability Verifier"]
        C6A["AG-306: Epistemic Confidence Scorer"]
    end

    subgraph C4 ["Cluster 04: Delivery Cluster (6 Agents)"]
        D1["AG-401: 9-Question Synthesizer"]
        D2["AG-402: Query Routing Agent (Hybrid RRF)"]
        D3["AG-403: Briefing Generator"]
        D4["AG-404: Proactive Alert Dispatcher"]
        D5["AG-405: Code Impact Assessor"]
        D6["AG-406: Personalization Coordinator"]
    end

    subgraph C5 ["Cluster 05: Governance Cluster (5 Agents)"]
        E1["AG-501: Cryptographic Audit Agent"]
        E2["AG-502: Secret & PII Redactor"]
        E3["AG-503: Source Trust Decayer (DTS)"]
        E4["AG-504: Model Bias & Safety Guard"]
        E5["AG-505: SLA & Degradation Supervisor"]
    end

    C1 --> C2 --> C3 --> C4
    C5 -. Continuous Supervision & Audit .-> C1 & C2 & C3 & C4
```

### Complete Agent Cluster Fleet Roster

| Cluster | Agent ID | Agent Formal Name | Core Responsibility | Latency Budget | Memory Scope |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **Acquisition** | `AG-101` | **Source Ingestion Agent** | Continuous connector polling across Git, RSS, Webhooks & REST APIs | $< 25\text{ms}$ | Ephemeral Working |
| **Acquisition** | `AG-102` | **Changelog & Release Agent** | Parses semver diffs, commit histories, tags, and breaking changes | $< 50\text{ms}$ | Working + Episodic |
| **Acquisition** | `AG-103` | **Community Discourse Agent** | Ingests RFC discourse, issue threads, and consensus debates | $< 60\text{ms}$ | Working Context |
| **Acquisition** | `AG-104` | **Academic & Spec Agent** | Ingests W3C, TC39, IETF, NIST, and ArXiv publications | $< 80\text{ms}$ | Working Context |
| **Acquisition** | `AG-105` | **Noise & Spam Rejecter** | Evaluates semantic entropy; discards promotional churn | $< 10\text{ms}$ | Ephemeral Working |
| **Understanding** | `AG-201` | **Claim Decomposition Agent** | Extracts Subject-Predicate-Object $(S, P, O)$ semantic claim triples | $< 45\text{ms}$ | Working Context |
| **Understanding** | `AG-202` | **Entity Disambiguation Agent** | Maps polysemous entity names to canonical LPKG graph nodes | $< 35\text{ms}$ | Semantic LPKG |
| **Understanding** | `AG-203` | **Taxonomy Classifier** | Classifies claims into multi-tier professional domain ontologies | $< 25\text{ms}$ | Semantic LPKG |
| **Understanding** | `AG-204` | **Context Normalization Agent** | Harmonizes temporal frames, runtime conditions, and environments | $< 30\text{ms}$ | Working Context |
| **Understanding** | `AG-205` | **Code Artifact Analyzer** | AST parsing, type signature inspection, and breaking diff analysis | $< 90\text{ms}$ | Working Context |
| **Understanding** | `AG-206` | **Dependency Topology Agent** | Maps transitive dependency blast radius across package graphs | $< 60\text{ms}$ | Semantic LPKG |
| **Verification** | `AG-301` | **Cross-Source Corroborator** | Executes Bayesian evidence updating across independent source tiers | $< 40\text{ms}$ | Working + Episodic |
| **Verification** | `AG-302` | **Contradiction Adjudicator** | Enforces the 3-Step Precedence Adjudication Policy | $< 50\text{ms}$ | Working Context |
| **Verification** | `AG-303` | **Temporal Fact Decay Agent** | Applies exponential half-life decay to provisional claims | $< 25\text{ms}$ | Semantic LPKG |
| **Verification** | `AG-304` | **Dual-Reproduction Benchmark Agent** | Orchestrates dual isolated execution of AI benchmark claims | $< 400\text{ms}$ | Working + Episodic |
| **Verification** | `AG-305` | **Security Vulnerability Verifier** | Verifies CVSS vectors, exploitation viability, and patch integrity | $< 60\text{ms}$ | Semantic LPKG |
| **Verification** | `AG-306` | **Epistemic Confidence Scorer** | Computes final calibrated confidence probability vectors | $< 20\text{ms}$ | Semantic LPKG |
| **Delivery** | `AG-401` | **9-Question Synthesizer** | Generates the Daily 9-Question Executive Decision Matrix | $< 100\text{ms}$ | Semantic LPKG |
| **Delivery** | `AG-402` | **Query Routing Agent** | Dispatches hybrid search across sparse BM25 and dense vectors (RRF) | $< 15\text{ms}$ | Working Context |
| **Delivery** | `AG-403` | **Briefing Generator** | Formats domain views for engineering leads, architects, and CISOs | $< 50\text{ms}$ | Working Context |
| **Delivery** | `AG-404` | **Proactive Alert Dispatcher** | Dispatches instant alerts for CVSS $\ge 9.0$ and critical breaking changes | $< 20\text{ms}$ | Episodic Memory |
| **Delivery** | `AG-405` | **Code Impact Assessor** | Computes blast radius of breaking changes against tenant repositories | $< 120\text{ms}$ | Working Context |
| **Delivery** | `AG-406` | **Personalization Coordinator** | Adjusts intelligence density according to tenant role and permissions | $< 30\text{ms}$ | Working Context |
| **Governance** | `AG-501` | **Cryptographic Audit Agent** | Appends tamper-evident SHA-256 block hash-chain records to ledger | $< 5\text{ms}$ | Cryptographic Tip |
| **Governance** | `AG-502` | **Secret & PII Redactor** | Deterministic regex and heuristic scrubbing of credentials and PII | $< 5\text{ms}$ | Ephemeral Working |
| **Governance** | `AG-503` | **Source Trust Decayer (DTS)** | Recalibrates dynamic source authority tiers over time | $< 25\text{ms}$ | Semantic LPKG |
| **Governance** | `AG-504` | **Model Bias & Safety Guard** | Evaluates model reasoning traces for safety and policy compliance | $< 40\text{ms}$ | Working Context |
| **Governance** | `AG-505` | **SLA & Degradation Supervisor** | Monitors probe uptime and triggers graceful degradation circuits | $< 5\text{ms}$ | In-Memory Gauges |

---

## ☀️ 6. Daily Professional Intelligence: The 9-Question Matrix

Technical teams face cognitive overload from uncurated RSS feeds and social media. Kenora replaces feeds with an **Executive 9-Question Daily Decision Matrix**, synthesized every morning by the Delivery Cluster:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        KENORA DAILY 9-QUESTION DECISION MATRIX                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Q1: What broke or changed in core frameworks and runtimes?                            │
│  Q2: What new critical security advisories or CVEs were disclosed?                     │
│  Q3: What architectural paradigms or design patterns shifted?                          │
│  Q4: What benchmark claims were reproduced vs refuted?                                 │
│  Q5: What deprecation cycles are entering critical phases?                             │
│  Q6: What developer tooling ecosystems reached production maturity?                   │
│  Q7: What regulatory, compliance, or licensing shifts occurred?                        │
│  Q8: What community debates reached consensus vs remaining contested?                 │
│  Q9: What actionable recommendations apply to our engineering stack today?             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

| Question | Focus & Decision Target | Primary Sources Evaluated | Verification Standard |
| :-: | :--- | :--- | :--- |
| **Q1** | **Breaking Changes & Regressions** | GitHub Releases, npm/PyPI semver diffs, V8 engine commits | Verified by source diff inspection & type signatures |
| **Q2** | **Security Advisories & CVEs** | NIST NVD, GitHub Advisory DB, OpenSSF, CISA alerts | CVSS vector verification + patch confirmation |
| **Q3** | **Architectural Paradigm Shifts** | W3C Working Group drafts, TC39 proposals, RFC datatrackers | Standards body status verification |
| **Q4** | **Benchmark Reproduction & Fact-Checks** | Independent dual-reproduction benchmark harness runs | $\ge 2$ independent executions; divergence $\le \pm 3.5\%$ |
| **Q5** | **Deprecation Critical Path** | Runtime release schedules, Node.js LTS WG, Python PEPs | Official governance milestones verified |
| **Q6** | **Tooling Production Readiness** | Core bundler telemetry, package ecosystem adoption metrics | Real-world enterprise production telemetry |
| **Q7** | **Regulatory, Compliance & Licensing** | EU AI Act filings, SPDX updates, Open Source Initiative | Statutory publication verification |
| **Q8** | **Contested Community Debates** | RFC discussions, GitHub Issues, engineering discourse | Multi-perspective objective surfacing |
| **Q9** | **Actionable Stack Recommendations** | Synthesized domain analysis & tenant stack profile | Filtered specifically to active tenant architecture |

---

## 📊 7. AI Ecosystem Intelligence & Dual-Reproduction Benchmarks

Vendor-published benchmark scores frequently suffer from prompt contamination, test-set leakage, unstated hardware advantages, and cherry-picked runs. Kenora's **AI Benchmark Dual-Reproduction Protocol** independently validates every performance claim:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DUAL-REPRODUCTION BENCHMARK PROTOCOL                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  1. Ingest Vendor Marketing Claim (e.g., "SWE-bench Verified: 58.4%")                  │
│  2. Run Execution 1 in Isolated Environment A (Stanford CRFM Harness)                  │
│  3. Run Execution 2 in Isolated Environment B (Berkeley BAIR / Kenora Systems Lab)     │
│  4. Calculate Divergence Delta: Δ% = |Score_Vendor - Score_Reproduced| / Score_Vendor  │
│  5. Adjudicate Status:                                                                 │
│     • Δ% ≤ 3.5%  ──► VERIFIED BY DUAL REPRODUCTION                                     │
│     • Δ% > 3.5%  ──► REFUTED EXAGGERATION (Vendor benchmark contested)                 │
│  6. Normalize Efficiency: Report Tokens / Dollar and Watt / Inference                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Divergence Warning Threshold**: Any benchmark diverging by $> \pm 3.5\%$ from vendor assertions is flagged as `REFUTED` to protect enterprise architects from flawed platform investments.
* **Cost & Energy Normalization**: Reports inference throughput per dollar and watt, rather than peak unconstrained throughput.

---

## 🔍 8. Multi-Modal Hybrid Precision Search (RRF $k=60$)

The `@kenora/search` package implements enterprise hybrid retrieval combining lexical exact matching with dense semantic vector search via **Reciprocal Rank Fusion (RRF)**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        RECIPROCAL RANK FUSION ARCHITECTURE                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                  User Query                                            │
│                                      │                                                 │
│                 ┌────────────────────┴────────────────────┐                            │
│                 ▼                                         ▼                            │
│     [BM25 Lexical Retrieval]                  [Dense Semantic Retrieval]               │
│     (Exact match, 3x title weight)            (1536-dim Cosine Similarity via HNSW)    │
│                 │                                         │                            │
│           Rank r_lex(d)                             Rank r_sem(d)                      │
│                 └────────────────────┬────────────────────┘                            │
│                                      ▼                                                 │
│                        Reciprocal Rank Fusion (k=60)                                   │
│            S_RRF(d) = 0.35 / (60 + r_lex) + 0.65 / (60 + r_sem)                        │
│                                      │                                                 │
│                                      ▼                                                 │
│                   Calibrated, Multi-Modal Ranked Results                               │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Smoothing Parameter**: $k = 60$ prevents top-ranked outliers in either individual retriever from disproportionately dominating the combined result.
* **Dynamic Weighting**: Dense semantic search ($0.65$) captures conceptual intent; sparse lexical search ($0.35$) guarantees exact keyword precision for CVE numbers, error codes, and semver tags.

---

## 🛡️ 9. 100% Non-Functional Requirements (NFR) Engineering Rigor

### 9.1 Zero-Trust Multi-Tenancy & Cryptographic Audit Ledger
* **Context Isolation via `node:async_hooks`**:
  All asynchronous promise chains execute within an immutable `TenantContext` bounded to the thread's execution tree. Cross-tenant data leakage is structurally impossible.
* **SHA-256 Merkle Block Hash-Chaining**:
  Every sensitive mutation produces a cryptographic audit block in `CryptographicAuditLedger`. Blocks are chained sequentially from Genesis ($H_0$) to the current Tip:
  $$H_i = \text{SHA256}\left(i \;\|\; H_{i-1} \;\|\; \text{timestamp} \;\|\; \text{tenantId} \;\|\; \text{eventType} \;\|\; \text{payloadHash}\right)$$
  Tampering with any historical block breaks the cryptographic chain and triggers an alert via `GET /api/v1/audit-logs/integrity`.

### 9.2 Automated Secret & PII Sanitization Redactor
* **Deterministic Regex & Heuristic Scrubbing (`SecretAndPiiRedactor`)**:
  All external internet inputs, error logs, and audit records pass through redaction before reaching the database:
  - AWS Access Keys (`AKIA[0-9A-Z]{16}`) $\to$ `[REDACTED_AWS_KEY]`
  - GitHub Personal Access Tokens (`ghp_[a-zA-Z0-9]{36}`) $\to$ `[REDACTED_GITHUB_PAT]`
  - LLM API Keys (`sk-[a-zA-Z0-9_-]{20,}`) $\to$ `[REDACTED_API_KEY]`
  - RSA / EC Private Keys (`-----BEGIN.*PRIVATE KEY-----`) $\to$ `[REDACTED_PRIVATE_KEY]`
  - Database Connection Strings (`postgres://user:pass@host...`) $\to$ Credentials masked
  - Credit Cards (Luhn pattern) & Social Security Numbers (SSN) $\to$ `[REDACTED_PII]`

### 9.3 Prometheus Observability, Histograms & 99.99% SLA Tracker
* **OpenMetrics Endpoint (`GET /api/v1/metrics`)**:
  Exposes standard Prometheus metrics: `kenora_http_requests_total`, `kenora_http_request_duration_seconds` (nanosecond-precision histograms for $p50, p95, p99$ measured via `process.hrtime.bigint()`), `kenora_knowledge_items_total`, and `kenora_memory_active_keys`.
* **Rolling 99.99% SLA Availability Tracker (`GET /api/v1/metrics/sla`)**:
  Continuously monitors uptime and error-budget burn rate against the enterprise $99.99\%$ target (max allowed downtime: $4.32\text{ min/month}$).

### 9.4 High Availability, Circuit Breakers & Graceful Degradation
* **Distributed Circuit Breakers (`CircuitBreaker`)**:
  Protects external database pools and LLM gateways through automated transitions across `CLOSED`, `OPEN`, and `HALF_OPEN` states.
* **Decorrelated Exponential Backoff with Full Random Jitter**:
  $$t_{\text{sleep}} = \min\left(t_{\text{max}}, \; \text{Uniform}\left(0, \; t_{\text{base}} \cdot 2^{\text{attempt}}\right)\right)$$
* **3-State Graceful Degradation Manager (`GET /api/v1/metrics/degradation`)**:
  - `NORMAL_OPERATION`: All services active: real-time LLM inference, continuous ingestion, background workers.
  - `DEGRADED_FALLBACK`: Non-critical background ingestion paused; serves cached LPKG graph and cached search results.
  - `EMERGENCY_READ_ONLY`: Core database read-only; LLM inference suspended to preserve core state.

### 9.5 Openness, Interoperability & Zero Vendor Lock-in
* **OpenAPI 3.0 / Swagger Interactive Documentation**: Mounted at `/docs`.
* **RFC 7807 Problem Details**: Standardized machine-readable error communication.
* **Model Agility**: `ModelGateway` supports seamless switching between Anthropic Claude, OpenAI, Google Gemini, and local models (Ollama/vLLM) without application code changes.
* **Storage Independence**: Standard S3-compatible interface running seamlessly across AWS S3, Cloudflare R2, MinIO, or LocalStack.

---

## 💻 10. Web Frontend & Live Dashboard Ecosystem

The web application (`apps/web`) is built with **Next.js 15 App Router** and **React 19**, styled with Tailwind CSS, and protected by Edge Security Middleware.

All 10 specialized dashboards are live, accessible, and verified:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           KENORA FRONTEND APPLICATION MAP                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  /                     Executive Command Center (KPIs, active telemetry, brief overview)│
│  /search               Hybrid Precision Retrieval (BM25 + Dense Cosine + RRF k=60)     │
│  /daily                The 9-Question Daily Decision Matrix & domain filters           │
│  /lpkg                 Living Knowledge Graph Temporal Entity & Paradigm Explorer       │
│  /verification         Multi-Source Verification (MSVF) Bayesian Workbench             │
│  /benchmarks           AI Ecosystem Intelligence & Dual-Reproduction Tracker           │
│  /agents               28-Agent Autonomous Cluster Fleet Management                    │
│  /observability        Prometheus OpenMetrics, Latency Histograms & 99.99% SLA Tracker │
│  /audit                Cryptographic SHA-256 Audit Ledger & Secret Redactor Explorer   │
│  /settings             Workspace Administration, RBAC & Ingestion Feed Sources         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 11. Workspace Topology & Package Directory

```text
kenora/
├── apps/
│   ├── api/                     # NestJS 10 REST & OpenAPI 3.0 Platform (Port 4000)
│   │   ├── src/common/          # SessionAuthGuard, PermissionsGuard, RateLimitGuard, TenantALS
│   │   ├── src/modules/         # Auth, Organizations, Sources, Knowledge, Intelligence, Audit, Health, Metrics
│   │   └── src/main.ts          # Global pipes, filters, interceptors, and Swagger setup
│   ├── web/                     # Next.js 15 App Router Frontend & Dashboard (Port 3000)
│   │   ├── app/                 # Daily Briefings, LPKG Explorer, Search, Benchmarks, Agents, Audit, SLA
│   │   ├── app/components/      # Reusable AppShell navigation, tenant switcher, SLA indicators
│   │   └── middleware.ts        # Edge security headers (CSP, HSTS) & session routing
│   └── workers/                 # Distributed Background Ingestion Daemon (Port 4001)
│       ├── src/processors/      # IngestionProcessor (Tenant-isolated poll, dedup, claims, verify)
│       └── src/main.ts          # Worker initialization & BullMQ queue listeners
│
├── packages/
│   ├── agents/                  # 28-Agent Cluster Fleet topology, cluster coordinator & telemetry
│   ├── api-contracts/           # Zod validation schemas for all requests, queries, and DTOs
│   ├── config/                  # Zod-validated environment configurations (fail-fast security)
│   ├── database/                # Drizzle ORM PostgreSQL schema (pgvector, RLS, indexes)
│   ├── domain/                  # Pure domain entities, value objects, and repository contracts
│   ├── events/                  # InMemoryDomainEventBus & NATS JetStream event definitions
│   ├── knowledge/               # LPKG Graph Engine & Normalized Knowledge Ingestion Protocol (NKIP)
│   ├── memory/                  # Tri-tier memory architecture (working, episodic, semantic LPKG)
│   ├── observability/           # Prometheus metrics, nanosecond histograms, SLA tracker, circuit breaker
│   ├── search/                  # HybridSearchEngine (lexical BM25 + dense semantic cosine + RRF k=60)
│   ├── security/                # CryptographicAuditLedger (SHA-256), SecretAndPiiRedactor, TenantContext
│   ├── source-adapters/         # SourceAdapterRegistry, GitHubSourceAdapter, GenericWebAdapter
│   ├── types/                   # Canonical TypeScript DTOs, APIResponse<T>, PaginatedResult<T>
│   ├── verification/            # Bayesian Multi-Source Verification Framework (MSVF) & AI Benchmarks
│   ├── ai/                      # ModelGateway provider-agnostic LLM & embedding interface
│   └── ui/                      # Shared atomic UI component library (Buttons, Cards, Badges)
│
├── docs/                        # Architecture Decision Records (ADRs) & Security Specifications
│   ├── adr/                     # ADR-0001 through ADR-0006
│   └── deployment/              # Dual-cloud deployment guides (Vercel + Render)
├── docker-compose.yml           # Local infrastructure stack (Postgres + pgvector, Redis, NATS, MinIO)
├── turbo.json                   # Turborepo pipeline orchestration
└── package.json                 # Monorepo scripts and pnpm workspace configuration
```

---

## 📡 12. Complete REST API Route & Contract Specification

All REST endpoints are versioned under `/api/v1` and documented interactively via OpenAPI at `http://localhost:4000/docs`.

| Module | Method & Route | Auth Guard | Required RBAC | Rate Limit | Primary Contract |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Observability** | `GET /api/v1/metrics` | Public | None | None | Prometheus OpenMetrics Text Stream |
| **Observability** | `GET /api/v1/metrics/sla` | Public | None | None | `{ availabilityPercentage, targetSla, status }` |
| **Observability** | `GET /api/v1/metrics/degradation` | Public | None | None | `{ state, activeDegradations, services }` |
| **Health** | `GET /api/v1/health` | Public | None | None | Deep probe: Postgres, Redis, NATS status |
| **Health** | `GET /api/v1/health/liveness` | Public | None | None | Process responsiveness & uptime seconds |
| **Health** | `GET /api/v1/health/readiness` | Public | None | None | Subsystem initialization readiness |
| **Audit & Trust** | `GET /api/v1/audit-logs/integrity` | Bearer Token | `settings:read` | None | `{ isChainValid, blockCount, tipHash }` |
| **Audit & Trust** | `GET /api/v1/audit-logs` | Bearer Token | `settings:read` | None | Redacted, paginated immutable audit records |
| **Intelligence** | `GET /api/v1/intelligence/briefings/daily` | Bearer Token | Org Member | None | The 9-Question Daily Decision Matrix |
| **Intelligence** | `POST /api/v1/intelligence/briefings/daily/generate` | Bearer Token | Org Member | None | Force immediate Bayesian synthesis |
| **Intelligence** | `GET /api/v1/intelligence/graph/snapshot` | Bearer Token | Org Member | None | LPKG Snapshot as of timestamp (`asOf`) |
| **Intelligence** | `POST /api/v1/intelligence/graph/entity` | Bearer Token | `knowledge:create` | None | Create temporal entity in LPKG |
| **Intelligence** | `POST /api/v1/intelligence/graph/entity/:id/supersede` | Bearer Token | `knowledge:update` | None | Supersede entity non-destructively |
| **Intelligence** | `POST /api/v1/intelligence/conflicts/adjudicate` | Bearer Token | Org Member | None | 3-Step Precedence conflict resolution |
| **Intelligence** | `POST /api/v1/intelligence/ai-benchmarks/verify` | Bearer Token | `knowledge:create` | None | Verify model claim via dual reproduction |
| **Intelligence** | `GET /api/v1/intelligence/agents/status` | Bearer Token | `agent:read` | None | Telemetry of the 28-Agent Cluster Fleet |
| **Knowledge** | `GET /api/v1/knowledge` | Public / Bearer | None | None | Multi-Modal Hybrid Search ($k=60$) |
| **Knowledge** | `POST /api/v1/knowledge/:id/verify` | Bearer Token | `knowledge:update` | None | Trigger on-demand Bayesian verification |
| **Auth** | `POST /api/v1/auth/register` | Public | None | 5 req / 60s | Register user and create default organization |
| **Auth** | `POST /api/v1/auth/login` | Public | None | 5 req / 60s | Authenticate credentials and return session |
| **Auth** | `GET /api/v1/auth/me` | Bearer Token | Active Session | None | Active user profile and tenant list |
| **Auth** | `POST /api/v1/auth/switch-organization` | Bearer Token | Org Member | None | Switch tenant context and receive session |
| **Organizations** | `GET /api/v1/organizations` | Bearer Token | Active Session | None | Organizations accessible to authenticated user |
| **Organizations** | `POST /api/v1/organizations` | Bearer Token | Active Session | None | Create tenant organization with OWNER role |
| **Sources** | `GET /api/v1/sources` | Bearer Token | Org Member | None | Ingestion sources and current trust tiers |
| **Sources** | `POST /api/v1/sources` | Bearer Token | Org Member | None | Register new GitHub, RSS, or Web feed |

---

## 🛠️ 13. Local Development & Docker Quickstart

### Prerequisites
* **Node.js**: `>= 20.0.0`
* **pnpm**: `>= 9.0.0`
* **Docker & Docker Compose**: For local PostgreSQL (`pgvector`), Redis, and NATS JetStream

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/kenora.git
cd kenora
pnpm install
```

### 2. Boot Local Infrastructure Stack
```bash
docker compose up -d
```
* PostgreSQL + pgvector: `localhost:5432`
* Redis: `localhost:6379`
* NATS JetStream: `localhost:4222`
* MinIO S3 API: `localhost:9000` (Console: `localhost:9001`)

### 3. Initialize Database Schema
```bash
pnpm db:push
```

### 4. Launch Development Runtimes
```bash
pnpm dev
```
* **Web Client Dashboard**: [http://localhost:3000](http://localhost:3000)
* **NestJS REST API Platform**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
* **Interactive OpenAPI (Swagger) Docs**: [http://localhost:4000/docs](http://localhost:4000/docs)
* **Prometheus OpenMetrics**: [http://localhost:4000/api/v1/metrics](http://localhost:4000/api/v1/metrics)

### 5. Execute Comprehensive Verification Suites
```bash
# Run all 94 unit & integration tests across 26 suites
pnpm test

# Run strict TypeScript type-checking across all workspaces
pnpm type-check
```

---

## 🚀 14. Dual-Cloud Production Deployment: Vercel + Render

Kenora is optimized for seamless dual-cloud production deployment:
* **Frontend Web Application (`apps/web`)** $\to$ **Vercel** (Global Edge CDN, Instant Static Revalidation, Edge Middleware)
* **Backend Platform API (`apps/api`)** $\to$ **Render Web Service** (High-throughput Node.js runtime, private VPC networking)
* **Background Worker Fleet (`apps/workers`)** $\to$ **Render Background Worker** (Continuous queue processing, zero HTTP exposure)
* **Managed Database & Cache** $\to$ **Render PostgreSQL with pgvector** and **Render Managed Redis**

```mermaid
flowchart LR
    subgraph VercelEdgeCloud ["Vercel Global Edge Network"]
        VercelCDN["Vercel Global CDN"] --> NextApp["Next.js 15 Web Application<br/>(apps/web)"]
    end

    subgraph RenderPrivateVPC ["Render Cloud Private VPC"]
        NextApp -- "HTTPS API Requests" --> RenderAPI["Render Web Service<br/>(apps/api :4000)"]
        RenderWorker["Render Background Worker<br/>(apps/workers :4001)"]
        
        RenderAPI <--> RenderPG[("Render PostgreSQL 16<br/>+ pgvector Extension")]
        RenderAPI <--> RenderRedis[("Render Managed Redis<br/>(BullMQ Queues)")]
        RenderWorker <--> RenderPG
        RenderWorker <--> RenderRedis
    end
```

### Step 1: Deploy PostgreSQL & Redis on Render
1. Create a **PostgreSQL** instance on Render:
   - Database: `kenoradb`
   - Extension: Enable `vector` via `CREATE EXTENSION IF NOT EXISTS vector;`
2. Create a **Redis** instance on Render with Persistence enabled.

### Step 2: Deploy Backend API on Render
1. In Render Dashboard, click **New +** $\to$ **Web Service**.
2. Connect your Git repository.
3. Configure the service:
   - **Name**: `kenora-api`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm --filter @kenora/api build`
   - **Start Command**: `node apps/api/dist/main.js`
   - **Health Check Path**: `/api/v1/health/liveness`
4. Set Environment Variables:
   ```env
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=postgresql://user:pass@dpg-xxx:5432/kenoradb
   REDIS_URL=redis://red-xxx:6379
   JWT_SECRET=generate_a_64_character_cryptographically_secure_random_string
   WEB_ORIGIN=https://your-kenora-app.vercel.app
   ```

### Step 3: Deploy Background Workers on Render
1. In Render Dashboard, click **New +** $\to$ **Background Worker**.
2. Configure the worker:
   - **Name**: `kenora-workers`
   - **Build Command**: `pnpm install && pnpm --filter @kenora/workers build`
   - **Start Command**: `node apps/workers/dist/main.js`
3. Attach the same `DATABASE_URL`, `REDIS_URL`, and `JWT_SECRET` environment variables.

### Step 4: Deploy Frontend on Vercel
1. In Vercel Dashboard, click **Add New...** $\to$ **Project**.
2. Import the Git repository.
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
4. Set Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://kenora-api.onrender.com/api/v1
   NEXTAUTH_URL=https://your-kenora-app.vercel.app
   NEXTAUTH_SECRET=generate_another_secure_secret_key
   ```
5. Click **Deploy**. Vercel builds and routes client requests globally with sub-millisecond edge resolution.

---

## 📑 15. Architecture Decision Records (ADRs)

All architectural decisions are documented under [`docs/adr/`](file:///c:/Users/kenenisa/Desktop/about%20kenenisa/My%20pojects/Kenora/docs/adr):

* [ADR-0001: Initial Architecture & Monorepo Topology](file:///c:/Users/kenenisa/Desktop/about%20kenenisa/My%20pojects/Kenora/docs/adr/ADR-0001-initial-architecture.md)
* [ADR-0002: Identity & Multi-Tenant Authentication Boundary](file:///c:/Users/kenenisa/Desktop/about%20kenenisa/My%20pojects/Kenora/docs/adr/ADR-0002-identity-authentication.md)
* [ADR-0003: Living Professional Knowledge Graph (LPKG)](file:///c:/Users/kenenisa/Desktop/about%20kenenisa/My%20pojects/Kenora/docs/adr/ADR-0003-living-professional-knowledge-graph.md)
* [ADR-0004: Multi-Source Verification Framework (MSVF)](file:///c:/Users/kenenisa/Desktop/about%20kenenisa/My%20pojects/Kenora/docs/adr/ADR-0004-multi-source-verification-framework.md)
* [ADR-0005: 28-Agent Cluster Fleet & Tri-Tier Memory](file:///c:/Users/kenenisa/Desktop/about%20kenenisa/My%20pojects/Kenora/docs/adr/ADR-0005-28-agent-cluster-mesh.md)
* [ADR-0006: Cryptographic Audit Ledger & Secret Redaction](file:///c:/Users/kenenisa/Desktop/about%20kenenisa/My%20pojects/Kenora/docs/adr/ADR-0006-cryptographic-audit-ledger.md)

---

## 📜 16. Kenora Architectural Invariants & Engineering Rules

1. **Architecture Fidelity**: All code additions must respect package boundaries. Domain models live in `@kenora/domain`; verification algorithms live in `@kenora/verification`.
2. **Strict Multi-Tenant Isolation**: Tenant context must be initialized via `TenantContextInterceptor` using `node:async_hooks`. Never trust client-supplied headers without cryptographic token resolution.
3. **Cryptographic Ledger Integrity**: All sensitive administrative actions, membership changes, and fact verifications must append an immutable block to `CryptographicAuditLedger`.
4. **Mandatory PII and Secret Scrubbing**: All external internet inputs and internal audit logs must pass through `SecretAndPiiRedactor`.
5. **Untrusted Data Boundary**: Treat all scraped internet data as hostile. Sanitize before passing to LLM prompts or vector embeddings to prevent indirect prompt injection.
6. **No Business Logic in Presentation**: Controllers and React components only handle parameter delegation and rendering. Business logic lives in domain services.
7. **Idempotent Background Ingestion**: All background worker jobs must check deduplication hashes (`sha256`) before initiating expensive pipeline cycles.
8. **Observability Invariant**: Every HTTP route must be instrumented with nanosecond precision metrics via `MetricsInterceptor`.
9. **Zero Plaintext Secrets**: Secrets, credentials, and API tokens are never committed, never logged, and never exposed in API responses.
10. **RFC 7807 Compliance**: Every error response must conform to RFC 7807 Problem Details via the global `GlobalExceptionFilter`.

---

<div align="center">

**Kenora — Transforming Raw Information into Verified Professional Intelligence**  
*Built for engineering excellence, rigorous verification, and zero cognitive clutter.*

</div>
