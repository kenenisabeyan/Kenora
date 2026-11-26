# ADR-0005: 28-Agent Autonomous Cluster Fleet & Tri-Tier Memory Architecture

## Status
Accepted

## Context
Monolithic AI assistants suffer from context window saturation, state bleeding across unrelated tasks, and lack of specialized operational boundaries. Managing continuous ingestion, claim decomposition, Bayesian verification, daily briefing synthesis, and cryptographic governance requires a modular, distributed multi-agent mesh.

## Decision
We architect Kenora around an autonomous **28-Agent Cluster Fleet** organized into five functional clusters:

1. **Acquisition Cluster (5 Agents)**:
   - Source Ingestion Agent
   - Changelog & Release Agent
   - Community Discourse Agent
   - Academic & Spec Agent
   - Autonomous Noise Identification (ANI) Rejecter
2. **Understanding Cluster (6 Agents)**:
   - Claim Decomposition Agent (Subject-Predicate-Object triples)
   - Entity Disambiguation Agent
   - Taxonomy Classifier
   - Context Normalization Agent
   - Code Artifact Analyzer
   - Dependency Topology Agent
3. **Verification Cluster (6 Agents)**:
   - Cross-Source Corroborator
   - Contradiction Adjudicator (3-Step Precedence)
   - Temporal Fact Decay Agent
   - Dual-Reproduction Benchmark Agent
   - Security Vulnerability Verifier (CVSS)
   - Epistemic Confidence Scorer
4. **Delivery Cluster (6 Agents)**:
   - 9-Question Synthesizer
   - Query Routing Agent (Hybrid RRF $k=60$)
   - Briefing Generator
   - Proactive Alert Dispatcher
   - Code Impact Assessor
   - Personalization Coordinator
5. **Governance Cluster (5 Agents)**:
   - Cryptographic Audit Agent (SHA-256 Block Chain)
   - Secret & PII Redactor
   - Source Trust Decayer
   - Model Bias & Safety Guard
   - SLA & Degradation Supervisor

### Tri-Tier Memory Architecture
Every agent is constrained to a tri-tier memory topology:
- **Tier 1 (Working Context)**: Ephemeral, in-memory execution scope bounding a single task turn.
- **Tier 2 (Episodic Memory)**: Redis-backed TTL cache storing recent task traces and deduplication hashes.
- **Tier 3 (Semantic Memory)**: PostgreSQL pgvector persistent knowledge graph (LPKG) with immutable temporal links.

## Consequences
- **Positive**: High task parallelism, isolation of concerns, zero state bleed between ingestion and security auditing.
- **Negative**: Distributed communication requires robust message-passing infrastructure (NATS JetStream + BullMQ).
