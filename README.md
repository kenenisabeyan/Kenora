<div align="center">

# KENORA
### The AI-Powered Professional Knowledge Infrastructure
**The Knowledge Intelligence Layer for Professional Decision-Making**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-EF4444.svg?logo=turborepo)](https://turbo.build/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2010-E0234E.svg?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015%20App%20Router-black.svg?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016%20%2B%20pgvector-336791.svg?logo=postgresql)](https://github.com/pgvector/pgvector)
[![Redis](https://img.shields.io/badge/Cache%20%26%20Queues-Redis%207%20%2B%20BullMQ-DC382D.svg?logo=redis)](https://redis.io/)
[![NATS](https://img.shields.io/badge/Event%20Mesh-NATS%20JetStream-27AAE1.svg?logo=nats.io)](https://nats.io/)
[![Vitest](https://img.shields.io/badge/Testing-Vitest%20(94%2F94%20Passed)-6E9F18.svg?logo=vitest)](https://vitest.dev/)
[![Prometheus](https://img.shields.io/badge/Observability-Prometheus%20OpenMetrics-E6522C.svg?logo=prometheus)](https://prometheus.io/)
[![Deployment](https://img.shields.io/badge/Dual--Cloud-Vercel%20%2B%20Render-000000.svg?logo=vercel)](#-production-deployment-guide-vercel--render)
[![License](https://img.shields.io/badge/License-Proprietary%20Commercial-gray.svg)](#)

*Derived from the foundational **Kenora Architecture & Vision Whitepaper v3.0** (July 2026).*

</div>

---

## 📑 Table of Contents

1. [Executive Summary & Foundational Vision](#-executive-summary--foundational-vision)
2. [End-to-End System Architecture](#-end-to-end-system-architecture)
3. [The 10 Proprietary Kenora Technologies](#-the-10-proprietary-kenora-technologies)
4. [The 28-Agent Autonomous Cluster Fleet](#-the-28-agent-autonomous-cluster-fleet)
5. [Daily Professional Intelligence: The 9-Question Matrix](#-daily-professional-intelligence-the-9-question-matrix)
6. [AI Ecosystem Intelligence & Dual-Reproduction Benchmarks](#-ai-ecosystem-intelligence--dual-reproduction-benchmarks)
7. [100% Non-Functional Requirements (NFR) Engineering Rigor](#-100-non-functional-requirements-nfr-engineering-rigor)
   - [Zero-Trust Multi-Tenancy & Cryptographic Audit Ledger](#1-zero-trust-multi-tenancy--cryptographic-audit-ledger)
   - [Secret & PII Sanitization Redactor](#2-secret--pii-sanitization-redactor)
   - [Prometheus Observability, Histograms & 99.99% SLA Tracker](#3-prometheus-observability-histograms--9999-sla-tracker)
   - [High Availability, Circuit Breakers & Graceful Degradation](#4-high-availability-circuit-breakers--graceful-degradation)
   - [Openness, Interoperability & Zero Vendor Lock-in](#5-openness-interoperability--zero-vendor-lock-in)
8. [Workspace Topology & Package Directory](#-workspace-topology--package-directory)
9. [Complete API Route & Contract Specification](#-complete-api-route--contract-specification)
10. [Local Development & Quickstart](#-local-development--quickstart)
11. [Production Deployment Guide: Vercel + Render](#-production-deployment-guide-vercel--render)
12. [Kenora Architectural Invariants & Engineering Rules](#-kenora-architectural-invariants--engineering-rules)

---

## 🌐 Executive Summary & Foundational Vision

The Internet solved information publishing. Search engines solved information retrieval. Social media solved information sharing. Large language models solved conversational reasoning. **None of these solved turning fragmented, unverified information into verified, connected, actionable professional intelligence—continuously, without requiring a professional to ask.**

Kenora occupies this specific, unclaimed layer as the world's first **AI-Powered Professional Knowledge Infrastructure**. It ingests knowledge streams from thousands of disparate sources, normalizes them, filters noise, resolves contradictions, verifies facts through a Bayesian multi-source framework, constructs a Living Professional Knowledge Graph (LPKG), and dispatches continuous intelligence directly to practitioners.

### Core Strategic Pillars

* **Flagship Vertical: Kenora Developer**: Full-Stack Web Development, distributed systems, browser runtimes, security vulnerability disclosures, and cloud native engineering.
* **Parallel Strategic Pillar: AI Ecosystem Intelligence**: Continuous monitoring, independent dual-reproduction benchmark tracking, vendor claim verification, and deprecation telemetry across LLM providers and open-weight models.
* **Dual Uncompromising Commitments**:
  1. **Strict Verification**: Every claim carries a traceable chain of primary evidence, epistemic confidence scores, and reasoning traces. No hallucinated authority.
  2. **Respect for Professional Attention**: Explicitly engineered to maximize knowledge gain per minute and help technical professionals disengage, completely informed, as rapidly as possible.

---

## 🏛️ End-to-End System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer ["1. Edge & Client Subsystem (apps/web - Vercel Edge)"]
        Browser["React 19 / Next.js 15 Client"] --> EdgeMW["Edge Security Middleware<br/>(CSP, HSTS, CORS, Correlation ID)"]
        EdgeMW --> Dashboard["Kenora Intelligence Console<br/>(Daily Briefings, LPKG Explorer, AI Benchmarks)"]
    end

    subgraph GatewayLayer ["2. API Platform & Security Boundary (apps/api - Render Web Service)"]
        Dashboard --> RateLimiter["RateLimitGuard (Sliding Window Redis/Memory)"]
        RateLimiter --> SessionGuard["SessionAuthGuard (Bearer ses_... Token Resolution)"]
        SessionGuard --> TenantALS["TenantContextInterceptor (node:async_hooks ALS)"]
        TenantALS --> RBACGuard["PermissionsGuard (RolePermissionMatrix Enforcement)"]
        RBACGuard --> MetricsInter["MetricsInterceptor (Nanosecond Latency Tracking)"]
        MetricsInter --> Controllers["NestJS REST & OpenAPI Controllers (/api/v1)"]
    end

    subgraph IntelligenceKernel ["3. Proprietary Intelligence & Reasoning Kernel"]
        Controllers --> LPKG["Living Professional Knowledge Graph (LPKG)"]
        Controllers --> MSVF["Multi-Source Verification Framework (MSVF)"]
        Controllers --> Synth["9-Question Daily Intelligence Synthesizer"]
        Controllers --> Bench["AI Dual-Reproduction Benchmark Engine"]
        Controllers --> AgentFleet["28-Agent Autonomous Cluster Mesh"]
    end

    subgraph SecurityAudit ["4. Cryptographic Security & Governance Kernel"]
        Controllers --> Redactor["SecretAndPiiRedactor (AWS, GitHub, LLM, PII)"]
        Redactor --> AuditLedger["CryptographicAuditLedger (SHA-256 Hash Chain)"]
        Controllers --> Degradation["GracefulDegradationManager (3-State Circuit)"]
        Controllers --> SLATracker["SlaAvailabilityTracker (Rolling 99.99% SLA)"]
    end

    subgraph DataPersistence ["5. Distributed Persistence & Event Backbone"]
        LPKG & MSVF --> PostgreSQL[("PostgreSQL 16 + Drizzle ORM<br/>(Row-Level Security & pgvector 1536-dim HNSW)")]
        SessionGuard & RateLimiter --> RedisCluster[("Redis Cluster 7<br/>(Session Tokens & Sliding-Window Buckets)")]
        AgentFleet --> JetStream["NATS JetStream (Domain Event Mesh)"]
        AgentFleet --> BullMQ["BullMQ Distributed Job Queues"]
    end

    subgraph WorkerCluster ["6. Autonomous Background Daemon (apps/workers - Render Worker)"]
        BullMQ --> IngestWorker["IngestionProcessor (AsyncLocalStorage Scoped)"]
        IngestWorker --> Adapters["Source Adapters (GitHub, RSS, W3C, ArXiv, Web)"]
        IngestWorker --> Pipeline["Knowledge Pipeline (Normalize, Dedup, Extract Claims)"]
        Pipeline --> MSVF
    end

    classDef client fill:#1e293b,stroke:#64748b,color:#f8fafc;
    classDef gateway fill:#0f766e,stroke:#14b8a6,color:#f8fafc;
    classDef kernel fill:#4338ca,stroke:#6366f1,color:#f8fafc;
    classDef security fill:#831843,stroke:#db2777,color:#f8fafc;
    classDef storage fill:#1e1b4b,stroke:#4f46e5,color:#f8fafc;
    classDef workers fill:#7c2d12,stroke:#ea580c,color:#f8fafc;

    class ClientLayer client;
    class GatewayLayer gateway;
    class IntelligenceKernel kernel;
    class SecurityAudit security;
    class DataPersistence storage;
    class WorkerCluster workers;
```

---

## 🔬 The 10 Proprietary Kenora Technologies

| Identifier | Technology Name | Architectural Responsibility & Implementation |
| :--- | :--- | :--- |
| **LPKG** | **Living Professional Knowledge Graph** | Temporal graph representing evolving concepts, tools, patterns, and libraries. Encodes semantic relationship vectors, temporal validity intervals, deprecation transitions, and supersession links. |
| **MSVF** | **Multi-Source Verification Framework** | Bayesian cross-source corroboration engine. Applies dynamic source authority weighting, contradiction penalty gradients, and multi-tier precedence adjudication. |
| **NKIP** | **Normalized Knowledge Ingestion Protocol** | Universal ingestion contract converting unstructured posts, changelogs, spec RFCs, security advisories, and podcasts into canonical semantic claim structures. |
| **DTS** | **Dynamic Trust Scoring** | Time-decaying source reputation system. Calibrates source trust scores according to empirical accuracy, verified correction frequency, and historical consistency. |
| **KCE** | **Knowledge Compounding Engine** | Synthesizes verified atomic claims into higher-order conceptual knowledge. Identifies meta-trends and architectural paradigm shifts across cross-domain nodes. |
| **ANI** | **Autonomous Noise Identification** | Real-time heuristic and semantic filter rejecting promotional marketing, superficial listicles, low-substance churn, and synthesized spam prior to ingestion. |
| **IKC** | **Institutional Knowledge Connectors** | High-fidelity connectors to foundational authorities (W3C, TC39, IETF, ISO, NIST, OpenSSF, GitHub Advisory DB, ArXiv) with first-tier authority precedence. |
| **ECN** | **Epistemic Confidence Networks** | Explicit quantification of uncertainty across all claims. Labels knowledge as `CONFIRMED`, `PROVISIONAL`, `CONTESTED`, or `REFUTED` with numeric confidence vectors. |
| **PKI** | **Professional Knowledge Interfaces** | Zero-clutter, high-signal presentation interfaces structured around the 9-Question Daily Decision Matrix, interactive LPKG visualization, and proactive alerts. |
| **XAI** | **Explainable AI & Provenance Tracing** | Strict evidence traceability. Every claim is linked to immutable source snapshots, citation chains, contradiction logs, and model reasoning steps. |

---

## 🤖 The 28-Agent Autonomous Cluster Fleet

Kenora operates a specialized multi-agent mesh divided into five functional clusters. Each agent executes bounded responsibilities, communicating via typed domain events over NATS JetStream and maintaining tri-tier memory (working context, episodic session history, and semantic knowledge graph).

```mermaid
graph LR
    subgraph C1 ["Acquisition Cluster (5 Agents)"]
        A1[Source Ingestion Agent]
        A2[Changelog & Release Agent]
        A3[Community Discourse Agent]
        A4[Academic & Spec Agent]
        A5[Noise & Spam Rejecter]
    end

    subgraph C2 ["Understanding Cluster (6 Agents)"]
        B1[Claim Decomposition Agent]
        B2[Entity Disambiguation Agent]
        B3[Taxonomy Classifier]
        B4[Context Normalization Agent]
        B5[Code Artifact Analyzer]
        B6[Dependency Topology Agent]
    end

    subgraph C3 ["Verification Cluster (6 Agents)"]
        C1A[Cross-Source Corroborator]
        C2A[Contradiction Adjudicator]
        C3A[Temporal Fact Decay Agent]
        C4A[Dual-Reproduction Benchmark Agent]
        C5A[Security Vulnerability Verifier]
        C6A[Epistemic Confidence Scorer]
    end

    subgraph C4 ["Delivery Cluster (6 Agents)"]
        D1[9-Question Synthesizer]
        D2[Query Routing Agent]
        D3[Briefing Generator]
        D4[Proactive Alert Dispatcher]
        D5[Code Impact Assessor]
        D6[Personalization Coordinator]
    end

    subgraph C5 ["Governance Cluster (5 Agents)"]
        E1[Cryptographic Audit Agent]
        E2[Secret & PII Redactor]
        E3[Source Trust Decayer]
        E4[Model Bias & Safety Guard]
        E5[SLA & Degradation Supervisor]
    end

    C1 --> C2 --> C3 --> C4
    C5 -. Supervises & Audits .-> C1 & C2 & C3 & C4
```

---

## ☀️ Daily Professional Intelligence: The 9-Question Matrix

Technical professionals face severe cognitive fragmentation. Rather than an uncurated feed of links, Kenora delivers a **Daily 9-Question Intelligence Matrix** every morning, providing a comprehensive operational snapshot of the domain:

| # | Question Focus | Core Intelligence Delivered | Primary Sources |
| :-: | :--- | :--- | :--- |
| **Q1** | **Breaking Changes & Regressions** | Incompatible breaking updates, silent behavior changes, and API removals in core frameworks. | GitHub Releases, npm/PyPI semver diffs |
| **Q2** | **Security Advisories & CVEs** | Newly disclosed zero-days, supply-chain exploits, CVE ratings, and vetted remediation steps. | CVE, GitHub Advisory DB, OpenSSF, NIST |
| **Q3** | **Architectural Paradigm Shifts** | Emerging architectural consensus (e.g. Server Components, Islands, edge execution, local-first). | Engineering blogs, RFCs, TC39 |
| **Q4** | **Benchmark Reproduction & Fact-Checks** | Dual-reproduction empirical verification of vendor speed, latency, or throughput claims. | Independent benchmark harness, dual test runs |
| **Q5** | **Deprecation Critical Path** | Runtimes and protocols entering end-of-life status requiring proactive migration plans. | Node.js LTS, Python PEPs, Browser vendors |
| **Q6** | **Tooling Production Readiness** | Bundlers, test frameworks, and engines reaching enterprise production maturity thresholds. | Production telemetry, adoption metrics |
| **Q7** | **Regulatory, Compliance & Licensing** | License changes (e.g. Redis/HashiCorp shifts), EU AI Act rules, and privacy compliance. | Legal filings, SPDX updates, Open Source OSI |
| **Q8** | **Contested Community Debates** | Areas lacking industry consensus with objective analysis of both perspectives. | RFC discourse, GitHub Discussions, HN |
| **Q9** | **Actionable Stack Recommendations** | Specific, high-impact actions engineering leads should execute for their active stack today. | Synthesized domain analysis & telemetry |

---

## 📊 AI Ecosystem Intelligence & Dual-Reproduction Benchmarks

To eliminate marketing distortion and vendor bias in the artificial intelligence sector, Kenora includes a dedicated **AI Benchmark Dual-Reproduction Protocol**:

* **Independent Dual Reproduction**: All published vendor benchmark numbers (e.g. MMLU, HumanEval, SWE-bench, inference tokens/sec, TTFT) are independently executed across two isolated environments.
* **Divergence Quantification**: If independent results differ from marketing claims by $> \pm 3.5\%$, the claim is flagged as `CONTESTED` or `REFUTED` with divergence delta ($\Delta\%$) clearly annotated.
* **Hardware & Cost Normalization**: Benchmarks report inference throughput per dollar and watt, rather than raw unconstrained peak throughput.

---

## 🛡️ 100% Non-Functional Requirements (NFR) Engineering Rigor

### 1. Zero-Trust Multi-Tenancy & Cryptographic Audit Ledger
* **Context Isolation via `node:async_hooks`**:
  All operations execute within an immutable `TenantContext` bounded to the asynchronous call tree. `TenantContext.getTenantId()` is enforced at the service boundary.
* **SHA-256 Merkle Block Hash-Chaining**:
  Every sensitive mutation produces a cryptographic audit block in `CryptographicAuditLedger`. Blocks are sequentially chained from Genesis ($H_0$) to the current Tip:
  $$H_i = \text{SHA256}\left(i \;\|\; H_{i-1} \;\|\; \text{timestamp} \;\|\; \text{tenantId} \;\|\; \text{eventType} \;\|\; \text{payloadHash}\right)$$
  Tampering with any historical block breaks the cryptographic chain and triggers an alert via `GET /api/v1/audit-logs/integrity`.

### 2. Secret & PII Sanitization Redactor
* **Automated Data Scrubbing (`SecretAndPiiRedactor`)**:
  All ingested content, log streams, and audit payloads pass through deterministic multi-pattern redaction:
  - AWS Access Keys (`AKIA[0-9A-Z]{16}`) $\to$ `[REDACTED_AWS_KEY]`
  - GitHub Personal Access Tokens (`ghp_[a-zA-Z0-9]{36}`) $\to$ `[REDACTED_GITHUB_PAT]`
  - LLM API Keys (`sk-[a-zA-Z0-9_-]{24,}`) $\to$ `[REDACTED_API_KEY]`
  - RSA/EC Private Key Blocks (`-----BEGIN.*PRIVATE KEY-----`) $\to$ `[REDACTED_PRIVATE_KEY]`
  - Database Connection Strings (`postgres://user:pass@host...`) $\to$ Credentials masked
  - Credit Cards (Luhn pattern) & Social Security Numbers (SSN) $\to$ `[REDACTED_PII]`

### 3. Prometheus Observability, Histograms & 99.99% SLA Tracker
* **OpenMetrics Endpoint (`GET /api/v1/metrics`)**:
  Exposes standard Prometheus metrics including `kenora_http_requests_total`, `kenora_http_request_duration_seconds` (nanosecond-precision histograms for $p50, p95, p99$), `kenora_knowledge_items_total`, and `kenora_memory_active_keys`.
* **Rolling 99.99% SLA Availability Tracker (`GET /api/v1/metrics/sla`)**:
  Continuously monitors probe uptime and error-budget burn rate against the enterprise $99.99\%$ target (max allowed downtime: $4.32\text{ min/month}$).

### 4. High Availability, Circuit Breakers & Graceful Degradation
* **Circuit Breakers (`CircuitBreaker`)**:
  Prevents cascading thread exhaustion across external LLM and database connectors through automated transitions across `CLOSED`, `OPEN`, and `HALF_OPEN` states.
* **Decorrelated Exponential Backoff with Full Random Jitter**:
  $$t_{\text{sleep}} = \min\left(t_{\text{max}}, \; \text{Uniform}\left(0, \; t_{\text{base}} \cdot 2^{\text{attempt}}\right)\right)$$
* **3-State Graceful Degradation Manager (`GET /api/v1/metrics/degradation`)**:
  - `NORMAL_OPERATION`: All services, real-time verification, and background workers healthy.
  - `DEGRADED_FALLBACK`: Non-critical background ingestion paused; serves cached LPKG and read-only searches.
  - `EMERGENCY_READ_ONLY`: Core database read-only; LLM inference suspended to preserve core state.

### 5. Openness, Interoperability & Zero Vendor Lock-in
* **OpenAPI 3.0 / Swagger Interactive Documentation**: Mounted at `/docs`.
* **RFC 7807 Problem Details**: Standardized machine-readable error communication.
* **Model Agility**: `ModelGateway` supports seamless switching between Anthropic Claude, OpenAI, Google Gemini, and local open-weight models (Ollama/vLLM) without application code changes.
* **Storage Independence**: Standard S3-compatible contract running seamlessly across AWS S3, Cloudflare R2, MinIO, or LocalStack.

---

## 📂 Workspace Topology & Package Directory

```text
kenora/
├── apps/
│   ├── api/                     # NestJS 10 REST & OpenAPI 3.0 Platform (Port 4000)
│   │   ├── src/common/          # SessionAuthGuard, PermissionsGuard, RateLimitGuard, TenantContext
│   │   ├── src/modules/         # Auth, Org, Sources, Knowledge, Intelligence, Audit, Health, Metrics
│   │   └── src/main.ts          # Global pipes, filters, interceptors, and Swagger setup
│   ├── web/                     # Next.js 15 App Router Frontend & Dashboard (Port 3000)
│   │   ├── app/                 # Daily Briefings, LPKG Explorer, AI Benchmarks, 28-Agent Fleet
│   │   └── middleware.ts        # Edge security headers (CSP, HSTS) & session routing
│   └── workers/                 # Distributed Background Ingestion Daemon (Port 4001)
│       ├── src/processors/      # IngestionProcessor (Tenant-isolated poll, dedup, claims, verify)
│       └── src/main.ts          # Worker initialization & BullMQ listeners
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
│   └── ai/                      # ModelGateway provider-agnostic LLM & embedding interface
│
├── docs/                        # Architecture Decision Records (ADRs) & Security Specifications
├── docker-compose.yml           # Local infrastructure stack (Postgres + pgvector, Redis, NATS, MinIO)
├── turbo.json                   # Turborepo pipeline orchestration
└── package.json                 # Monorepo scripts and pnpm workspace configuration
```

---

## 📡 Complete API Route & Contract Specification

All REST endpoints are versioned under `/api/v1` and documented interactively via OpenAPI at `http://localhost:4000/docs`.

| Domain Module | Method & Route | Auth Guard | Required RBAC | Rate Limit | Primary Contract |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Observability** | `GET /api/v1/metrics` | Public | None | None | Prometheus / OpenMetrics Text Format |
| **Observability** | `GET /api/v1/metrics/sla` | Public | None | None | `{ availabilityPercentage, targetSla, status }` |
| **Observability** | `GET /api/v1/metrics/degradation` | Public | None | None | `{ state, activeDegradations, services }` |
| **Health** | `GET /api/v1/health` | Public | None | None | Deep probe: Postgres, Redis, NATS status |
| **Health** | `GET /api/v1/health/liveness` | Public | None | None | Process responsiveness & uptime seconds |
| **Health** | `GET /api/v1/health/readiness` | Public | None | None | Subsystem initialization readiness |
| **Audit & Trust** | `GET /api/v1/audit-logs/integrity` | Bearer Token | `settings:read` | None | `{ isChainValid, blockCount, tipHash }` |
| **Audit & Trust** | `GET /api/v1/audit-logs` | Bearer Token | `settings:read` | None | Redacted, paginated immutable audit records |
| **Intelligence** | `GET /api/v1/intelligence/daily` | Bearer Token | Org Member | None | The 9-Question Daily Decision Matrix |
| **Intelligence** | `GET /api/v1/intelligence/lpkg` | Bearer Token | Org Member | None | Graph nodes, relations, and evolution timelines |
| **Intelligence** | `GET /api/v1/intelligence/benchmarks`| Bearer Token | Org Member | None | AI Model Dual-Reproduction Benchmark Records |
| **Intelligence** | `GET /api/v1/intelligence/agents` | Bearer Token | Org Member | None | Status of the 28-Agent Cluster Fleet |
| **Auth** | `POST /api/v1/auth/register` | Public | None | 5 req / 60s | Register user and create default organization |
| **Auth** | `POST /api/v1/auth/login` | Public | None | 5 req / 60s | Authenticate credentials and return session |
| **Auth** | `GET /api/v1/auth/me` | Bearer Token | Active Session | None | Active user profile and organization list |
| **Auth** | `POST /api/v1/auth/switch-organization`| Bearer Token | Org Member | None | Switch tenant context and receive updated token |
| **Organizations** | `GET /api/v1/organizations` | Bearer Token | Active Session | None | Organizations accessible to authenticated user |
| **Organizations** | `POST /api/v1/organizations` | Bearer Token | Active Session | None | Create tenant organization with OWNER role |
| **Knowledge** | `GET /api/v1/knowledge` | Bearer Token | Org Member | None | Hybrid RRF Search ($k=60$) & filtered claims |
| **Knowledge** | `POST /api/v1/knowledge/:id/verify` | Bearer Token | `knowledge:update` | None | Trigger Bayesian corroboration on target item |
| **Sources** | `GET /api/v1/sources` | Bearer Token | Org Member | None | Ingestion sources and current trust tiers |
| **Sources** | `POST /api/v1/sources` | Bearer Token | Org Member | None | Register new GitHub, RSS, or Web feed |

---

## 🛠️ Local Development & Quickstart

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

### 2. Boot Local Infrastructure
```bash
docker compose up -d
```
* PostgreSQL + pgvector: `localhost:5432`
* Redis: `localhost:6379`
* NATS JetStream: `localhost:4222`
* MinIO (S3 compatible): `localhost:9000` (Console: `localhost:9001`)

### 3. Initialize Database Schema
```bash
pnpm db:push
```

### 4. Launch Local Development Services
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

# Run strict TypeScript type-checking across all packages
pnpm type-check
```

---

## 🚀 Production Deployment Guide: Vercel + Render

Kenora is engineered for seamless dual-cloud production deployment:
* **Frontend Web Application (`apps/web`)** $\to$ **Vercel** (Global Edge CDN, Instant Static Revalidation, Edge Middleware)
* **Backend Platform API (`apps/api`)** $\to$ **Render Web Service** (High-throughput Node.js runtime, internal private networking)
* **Background Worker Fleet (`apps/workers`)** $\to$ **Render Background Worker** (Continuous queue processing, zero HTTP exposure)
* **Managed Database & Cache** $\to$ **Render PostgreSQL with pgvector** and **Render Managed Redis**

```mermaid
flowchart LR
    subgraph VercelCloud ["Vercel Edge Platform"]
        VercelEdge["Vercel Edge Network"] --> NextWeb["Next.js 15 Web App<br/>(apps/web)"]
    end

    subgraph RenderCloud ["Render Cloud Environment"]
        NextWeb -- "HTTPS /api/v1" --> RenderAPI["Render Web Service<br/>(apps/api)"]
        RenderWorker["Render Background Worker<br/>(apps/workers)"]
        
        RenderAPI <--> RenderPG[("Render PostgreSQL 16<br/>+ pgvector")]
        RenderAPI <--> RenderRedis[("Render Managed Redis<br/>(BullMQ Queues)")]
        RenderWorker <--> RenderPG
        RenderWorker <--> RenderRedis
    end
```

### Step 1: Deploy PostgreSQL & Redis on Render
1. Create a new **PostgreSQL** instance on Render:
   - Name: `kenora-postgres`
   - Database: `kenoradb`
   - Extensions: Enable `vector` via `CREATE EXTENSION IF NOT EXISTS vector;`
2. Create a new **Redis** instance on Render:
   - Name: `kenora-redis`
   - Plan: Standard (Persistence enabled)

### Step 2: Deploy Backend API on Render
1. In Render Dashboard, click **New +** $\to$ **Web Service**.
2. Connect your Git repository.
3. Configure the service:
   - **Name**: `kenora-api`
   - **Environment**: `Node`
   - **Root Directory**: Leave blank (uses repo root)
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
   - **Build Command**: Automatically detected (`turbo run build` or `next build`)
4. Set Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://kenora-api.onrender.com/api/v1
   NEXTAUTH_URL=https://your-kenora-app.vercel.app
   NEXTAUTH_SECRET=generate_another_secure_secret_key
   ```
5. Click **Deploy**. Vercel will build and route client requests globally with sub-millisecond edge resolution.

---

## 📜 Kenora Architectural Invariants & Engineering Rules

1. **Architecture Fidelity**: All code additions must respect package boundaries. Domain models live in `@kenora/domain`; verification algorithms live in `@kenora/verification`.
2. **Strict Multi-Tenant Isolation**: Tenant context must be initialized via `TenantContextInterceptor` using `node:async_hooks`. Never trust client-supplied headers without cryptographic token resolution.
3. **Cryptographic Ledger Integrity**: All sensitive administrative actions and tenant modifications must append an entry to `CryptographicAuditLedger`.
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
