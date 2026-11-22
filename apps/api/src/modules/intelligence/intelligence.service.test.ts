import { describe, it, expect, beforeEach } from "vitest";
import { IntelligenceService } from "./intelligence.service";
import { AuthorityTier, KnowledgeItemDTO } from "@kenora/types";

describe("IntelligenceService (Whitepaper V3 Implementation)", () => {
  let service: IntelligenceService;
  const tenantId = "ten_int_test";
  const userId = "usr_lead_arch";

  beforeEach(() => {
    service = new IntelligenceService();
  });

  describe("Daily Professional Intelligence 9-Question Pipeline", () => {
    it("should synthesize complete 9-question report with noise distillation", async () => {
      const mockItems: KnowledgeItemDTO[] = [
        {
          id: "item-1",
          tenantId,
          sourceId: "src-rfc",
          title: "RFC 9114 HTTP/3 Formal Specification Finalized",
          content: "The IETF has finalized RFC 9114 standardizing HTTP/3 over QUIC transport layer.",
          contentType: "paper",
          url: "https://datatracker.ietf.org/doc/rfc9114/",
          confidenceScore: 98,
          verificationStatus: "verified",
          tags: ["networking", "http3", "quic"],
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "item-2",
          tenantId,
          sourceId: "src-cve",
          title: "CVE-2026-4412 Critical Buffer Overflow in OpenSSL Transport",
          content: "Critical severity advisory affecting TLS handshakes in legacy cryptographic ciphers.",
          contentType: "advisory",
          url: "https://nvd.nist.gov/vuln/detail/CVE-2026-4412",
          confidenceScore: 96,
          verificationStatus: "verified",
          tags: ["security", "openssl", "cve"],
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const report = await service.getOrGenerateDailyReport(tenantId, userId, mockItems);

      expect(report.id).toBeDefined();
      expect(report.tenantId).toBe(tenantId);
      expect(report.userId).toBe(userId);
      expect(report.highImpactItemsCount).toBe(2);
      expect(report.distillationRatio).toContain("noise eliminated");

      // Verify all 9 questions
      const q = report.nineQuestions;
      expect(q.whatChanged).toContain("RFC 9114");
      expect(q.whyItMatters).toBeDefined();
      expect(q.whoIsAffected).toContain("Distributed Systems Architects");
      expect(q.confidenceAndEvidence.confidenceScore).toBeGreaterThanOrEqual(95);
      expect(q.confidenceAndEvidence.evidenceUrls).toContain("https://datatracker.ietf.org/doc/rfc9114/");
      expect(q.confidenceAndEvidence.authorityTiers).toContain(AuthorityTier.TIER_1_OFFICIAL);
      expect(q.recommendedAction).toBeDefined();
      expect(q.whatToLearn).toBeDefined();
      expect(q.whatToIgnore).toBeDefined();
      expect(q.emergingTrends.length).toBeGreaterThan(0);
      expect(q.forecast).toBeDefined();
    });
  });

  describe("Living Professional Knowledge Graph (LPKG)", () => {
    it("should handle entity creation and non-destructive supersession with evolution timeline", async () => {
      const entity = await service.createGraphEntity(tenantId, {
        tenantId,
        name: "PostgreSQL Connection Model",
        entityType: "pattern",
        status: "active",
        validityInterval: { validFrom: "2020-01-01T00:00:00.000Z" },
        attributes: { model: "Process-based" },
        confidenceScore: 94,
      });

      expect(entity.id).toBeDefined();

      const { previousEntity, updatedEntity } = await service.supersedeGraphEntity(
        tenantId,
        entity.id,
        {
          attributes: { model: "Thread-based" },
        },
        "PostgreSQL architecture proposal introduces multi-threaded backend processes",
      );

      expect(previousEntity.status).toBe("superseded");
      expect(updatedEntity.status).toBe("active");
      expect(updatedEntity.attributes.model).toBe("Thread-based");

      const timeline = await service.getEntityEvolutionTimeline(tenantId, entity.id);
      expect(timeline.versions.length).toBe(2);
      expect(timeline.versions[1].supersedingReason).toContain("multi-threaded");
    });
  });

  describe("AI Ecosystem Intelligence & Benchmark Reproduction Protocol", () => {
    it("should cap vendor benchmark at provisional confidence until corroborated by >= 2 independent reproductions", async () => {
      // 1. Single vendor benchmark (no reproductions)
      const provisional = await service.verifyAIBenchmark(
        "rec-01",
        "gemini-ultra-pro",
        "SWE-bench Verified",
        62.4,
        [],
      );

      expect(provisional.verificationStatus).toBe("provisional_vendor_reported");
      expect(provisional.confidenceScore).toBeLessThanOrEqual(70);

      // 2. Verified with dual reproduction
      const verified = await service.verifyAIBenchmark(
        "rec-01",
        "gemini-ultra-pro",
        "SWE-bench Verified",
        62.4,
        [
          {
            auditorOrganization: "Independent Lab A",
            reproducedScore: 62.1,
            variancePercentage: -0.3,
            hardwareConfig: "8x H100",
            verificationDate: "2026-07-01T00:00:00.000Z",
            reproductionConfirmed: true,
          },
          {
            auditorOrganization: "Independent Lab B",
            reproducedScore: 62.5,
            variancePercentage: 0.1,
            hardwareConfig: "8x H100",
            verificationDate: "2026-07-03T00:00:00.000Z",
            reproductionConfirmed: true,
          },
        ],
      );

      expect(verified.verificationStatus).toBe("verified_by_reproduction");
      expect(verified.confidenceScore).toBe(95);
    });
  });

  describe("28-Agent Cluster Architecture", () => {
    it("should return telemetry across all 5 clusters and 28 agents", () => {
      const clusters = service.getAgentClustersStatus();
      expect(clusters.length).toBe(5);

      const totalAgents = clusters.reduce((acc, c) => acc + c.totalAgents, 0);
      expect(totalAgents).toBe(28);
    });
  });
});
