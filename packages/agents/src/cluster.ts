import {
  AgentClusterType,
  KenoraAgentSpec,
  ClusterStatus,
} from "@kenora/types";

/**
 * Kenora 28-Agent Cluster Registry & Specification
 * Aligned with Architecture Whitepaper v3.0 (28 Cooperating Autonomous Agents across 5 Clusters)
 */

export const KENORA_28_AGENTS: KenoraAgentSpec[] = [
  // 1. Acquisition Cluster (6 agents)
  {
    id: "agent-acq-crawler",
    name: "Source Crawler Agent",
    cluster: "acquisition",
    description: "Performs autonomous deep crawling of official technical documentation and specifications.",
    capabilities: ["crawl", "html_parsing", "sitemap_discovery"],
  },
  {
    id: "agent-acq-feed",
    name: "RSS & Feed Monitor Agent",
    cluster: "acquisition",
    description: "Monitors syndication feeds for real-time announcements, changelogs, and release notes.",
    capabilities: ["rss", "atom", "delta_detection"],
  },
  {
    id: "agent-acq-git",
    name: "Git Repository Watcher Agent",
    cluster: "acquisition",
    description: "Tracks code commits, releases, semver changes, and pull request milestones on primary repos.",
    capabilities: ["git_diff", "semver_eval", "tag_monitor"],
  },
  {
    id: "agent-acq-paper",
    name: "Research Paper Ingest Agent",
    cluster: "acquisition",
    description: "Ingests preprints, arXiv technical papers, and academic publications.",
    capabilities: ["pdf_extraction", "latex_parsing", "bibtex_analysis"],
  },
  {
    id: "agent-acq-community",
    name: "Community Discussion Monitor Agent",
    cluster: "acquisition",
    description: "Surveys developer community discussions, RFCs, and discourse for emerging issues.",
    capabilities: ["sentiment_tracking", "thread_summarization"],
  },
  {
    id: "agent-acq-advisory",
    name: "Advisory & CVE Watch Agent",
    cluster: "acquisition",
    description: "Monitors National Vulnerability Database (NVD), GHSA, and zero-day advisories.",
    capabilities: ["cve_matching", "cvss_scoring", "exploit_correlation"],
  },

  // 2. Understanding Cluster (6 agents)
  {
    id: "agent-und-entity",
    name: "Entity Extractor Agent",
    cluster: "understanding",
    description: "Identifies and standardizes technical entities, libraries, languages, and architectures.",
    capabilities: ["ner", "entity_linking", "canonicalization"],
  },
  {
    id: "agent-und-claim",
    name: "Claim Parser Agent",
    cluster: "understanding",
    description: "Decomposes complex technical prose into structured Subject-Predicate-Object claims.",
    capabilities: ["spo_extraction", "dependency_parsing"],
  },
  {
    id: "agent-und-aligner",
    name: "Semantic Aligner Agent",
    cluster: "understanding",
    description: "Aligns disparate domain ontologies and synonym sets across platforms.",
    capabilities: ["ontology_mapping", "vector_alignment"],
  },
  {
    id: "agent-und-normalizer",
    name: "Context Normalizer Agent",
    cluster: "understanding",
    description: "Resolves conflicting terminology and converts ambiguous jargon into standardized nomenclature.",
    capabilities: ["jargon_disambiguation", "context_expansion"],
  },
  {
    id: "agent-und-taxonomy",
    name: "Taxonomy Classifier Agent",
    cluster: "understanding",
    description: "Classifies documents across multi-tier hierarchical professional domain taxonomies.",
    capabilities: ["hierarchical_classification", "multilabel_tagging"],
  },
  {
    id: "agent-und-vocab",
    name: "Vocabulary Tuner Agent (ANI)",
    cluster: "understanding",
    description: "Executes Adaptive Niche Intelligence to dynamically learn emerging specialized vocabularies.",
    capabilities: ["term_frequency_drift", "vocabulary_expansion"],
  },

  // 3. Verification Cluster (6 agents)
  {
    id: "agent-ver-corroborator",
    name: "Multi-Source Corroborator Agent",
    cluster: "verification",
    description: "Computes Bayesian corroboration across primary sources to establish claim validity.",
    capabilities: ["bayesian_inference", "source_cross_referencing"],
  },
  {
    id: "agent-ver-contradiction",
    name: "Contradiction Detector Agent",
    cluster: "verification",
    description: "Executes natural language inference (NLI) to flag contradictions between assertions.",
    capabilities: ["nli_contradiction", "assertion_diff"],
  },
  {
    id: "agent-ver-trust",
    name: "Source Trust Scorer Agent (DTS)",
    cluster: "verification",
    description: "Calculates Dynamic Trust Scores based on historical accuracy, retraction rate, and pedigree.",
    capabilities: ["dts_scoring", "pedigree_eval"],
  },
  {
    id: "agent-ver-benchmark",
    name: "AI Benchmark Verifier Agent",
    cluster: "verification",
    description: "Enforces the Benchmark Reproduction Protocol by auditing independent reproduction results.",
    capabilities: ["reproduction_audit", "variance_analysis", "provisional_capping"],
  },
  {
    id: "agent-ver-temporal",
    name: "Temporal Validity Agent",
    cluster: "verification",
    description: "Monitors fact lifespans, detects version obsolescence, and establishes validity intervals.",
    capabilities: ["validity_interval_scoring", "staleness_detection"],
  },
  {
    id: "agent-ver-evidence",
    name: "Evidence Auditor Agent",
    cluster: "verification",
    description: "Builds cryptographic provenance trails and citation chains for every extracted fact.",
    capabilities: ["provenance_chaining", "merkle_evidence_hash"],
  },

  // 4. Delivery Cluster (5 agents)
  {
    id: "agent-del-synthesizer",
    name: "Daily Briefing Synthesizer Agent",
    cluster: "delivery",
    description: "Assembles concise, role-tailored daily executive intelligence briefings.",
    capabilities: ["briefing_compilation", "executive_summary"],
  },
  {
    id: "agent-del-nine-questions",
    name: "Nine-Question Decision Analyzer Agent",
    cluster: "delivery",
    description: "Translates complex verified intelligence into the actionable 9-Question Response Pipeline.",
    capabilities: ["nine_question_generation", "impact_action_mapping"],
  },
  {
    id: "agent-del-compressor",
    name: "Knowledge Compressor Agent (IKC)",
    cluster: "delivery",
    description: "Filters noise and compresses thousands of events into ~12 essential high-signal items.",
    capabilities: ["ikc_compression", "noise_elimination"],
  },
  {
    id: "agent-del-alerts",
    name: "Urgent Alert Dispatcher Agent",
    cluster: "delivery",
    description: "Dispatches immediate critical alerts for breaking CVEs, breaking changes, or deprecations.",
    capabilities: ["p1_alerting", "webhook_dispatch"],
  },
  {
    id: "agent-del-weekly",
    name: "Weekly Longitudinal Synthesis Agent",
    cluster: "delivery",
    description: "Produces deep weekly trajectory syntheses and emerging trend forecasts.",
    capabilities: ["macro_trend_analysis", "forecasting"],
  },

  // 5. Governance Cluster (5 agents)
  {
    id: "agent-gov-bias",
    name: "Bias Detector Agent",
    cluster: "governance",
    description: "Detects source over-concentration, marketing hyperbole, and vendor bias.",
    capabilities: ["bias_indexing", "hype_filtration"],
  },
  {
    id: "agent-gov-audit",
    name: "Audit Ledger Recorder Agent",
    cluster: "governance",
    description: "Writes immutable audit records of all verification, conflict, and trust adjustments.",
    capabilities: ["immutable_logging", "audit_chaining"],
  },
  {
    id: "agent-gov-privacy",
    name: "Privacy Sanitizer Agent",
    cluster: "governance",
    description: "Redacts PII, private keys, authorization tokens, and confidential corporate identifiers.",
    capabilities: ["pii_redaction", "secret_masking"],
  },
  {
    id: "agent-gov-deprecation",
    name: "Fact Deprecation Monitor Agent",
    cluster: "governance",
    description: "Identifies superseded assertions and deprecates obsolete graph nodes.",
    capabilities: ["graph_deprecation", "supersede_triggering"],
  },
  {
    id: "agent-gov-compliance",
    name: "Compliance & Licensing Enforcer Agent",
    cluster: "governance",
    description: "Validates license compatibility (GPL, Apache, MIT, Proprietary) and fair-use boundaries.",
    capabilities: ["license_compliance", "fair_use_audit"],
  },
];

export class KenoraAgentClusterOrchestrator {
  private agentSpecs = new Map<string, KenoraAgentSpec>();

  constructor() {
    for (const spec of KENORA_28_AGENTS) {
      this.agentSpecs.set(spec.id, spec);
    }
  }

  getAgent(id: string): KenoraAgentSpec | undefined {
    return this.agentSpecs.get(id);
  }

  getAgentsByCluster(cluster: AgentClusterType): KenoraAgentSpec[] {
    return KENORA_28_AGENTS.filter((a) => a.cluster === cluster);
  }

  getAllClustersStatus(): ClusterStatus[] {
    const clusters: AgentClusterType[] = [
      "acquisition",
      "understanding",
      "verification",
      "delivery",
      "governance",
    ];

    return clusters.map((c) => {
      const agents = this.getAgentsByCluster(c);
      return {
        cluster: c,
        totalAgents: agents.length,
        activeAgents: agents.length,
        healthy: true,
        agents,
      };
    });
  }
}
