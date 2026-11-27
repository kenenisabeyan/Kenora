import { SourceAdapterRegistry } from "@kenora/source-adapters";
import { createLogger } from "@kenora/observability";
import { TenantContext, AISafetyShield } from "@kenora/security";
import { DefaultKnowledgePipelineProcessor, NormalizedItem } from "@kenora/knowledge";
import { BayesianVerificationEngine } from "@kenora/verification";

const logger = createLogger({ serviceName: "kenora-workers" });

export interface IngestionJobPayload {
  organizationId: string;
  sourceId: string;
  adapterType: string;
  url: string;
  correlationId?: string;
}

export interface IngestionProcessingSummary {
  sourceId: string;
  totalFetched: number;
  normalizedCount: number;
  duplicateCount: number;
  verifiedCount: number;
  quarantinedCount?: number;
}

export class IngestionProcessor {
  private registry = new SourceAdapterRegistry();
  private pipelineProcessor = new DefaultKnowledgePipelineProcessor();
  private verificationEngine = new BayesianVerificationEngine();

  async processSourcePolling(
    jobData: IngestionJobPayload,
  ): Promise<IngestionProcessingSummary> {
    if (!jobData.organizationId) {
      throw new Error(
        "WORKER_ERROR: Job payload missing required organizationId",
      );
    }

    // Re-establish trusted execution context for background job via AsyncLocalStorage
    return TenantContext.run(
      {
        tenantId: jobData.organizationId,
        correlationId: jobData.correlationId || `job-${Date.now()}`,
      },
      async () => {
        const activeTenant = TenantContext.get();
        logger.info(
          {
            activeTenant,
            sourceId: jobData.sourceId,
            adapterType: jobData.adapterType,
          },
          "Executing background source ingestion job in tenant context",
        );

        const adapter = this.registry.get(jobData.adapterType);
        if (!adapter) {
          logger.warn(
            { adapterType: jobData.adapterType },
            "Adapter type not registered, falling back to generic",
          );
          return {
            sourceId: jobData.sourceId,
            totalFetched: 0,
            normalizedCount: 0,
            duplicateCount: 0,
            verifiedCount: 0,
          };
        }

        const health = await adapter.checkHealth();
        logger.info(
          { adapterType: jobData.adapterType, health },
          "Adapter health verified in tenant scope",
        );

        const rawItems = await adapter.fetchLatest(jobData.url);
        let normalizedCount = 0;
        let duplicateCount = 0;
        let verifiedCount = 0;
        let quarantinedCount = 0;

        for (const raw of rawItems) {
          // 1. Normalize
          const normalized: NormalizedItem = await this.pipelineProcessor.normalize(
            raw,
            jobData.adapterType,
          );
          normalizedCount++;

          // 2. Safety & Prompt Injection Perimeter Scan (NFR Safety)
          const safetyScan = AISafetyShield.scan(normalized.title + " " + normalized.content);
          if (!safetyScan.isSafe) {
            logger.warn(
              {
                itemId: normalized.externalId,
                threatLevel: safetyScan.threatLevel,
                riskScore: safetyScan.riskScore,
                flagged: safetyScan.flaggedPatterns,
              },
              "Item rejected and quarantined to DLQ due to AI safety violation",
            );
            quarantinedCount++;
            continue;
          }

          // 3. Deduplicate
          const dedupCheck = await this.pipelineProcessor.deduplicate(
            normalized,
            activeTenant,
          );
          if (dedupCheck.isDuplicate) {
            duplicateCount++;
            continue;
          }

          // 4. Extract Claims & Entities
          const claims = await this.pipelineProcessor.extractClaims(normalized);
          const entities = await this.pipelineProcessor.extractEntities(normalized);

          // 5. Verification
          const verification = await this.verificationEngine.verifyItem(
            normalized.externalId,
            activeTenant,
          );
          if (verification.status === "verified") {
            verifiedCount++;
          }

          logger.debug(
            {
              itemId: normalized.externalId,
              claimsCount: claims.length,
              entitiesCount: entities.length,
              status: verification.status,
            },
            "Item pipeline cycle completed",
          );
        }

        logger.info(
          {
            activeTenant,
            itemCount: rawItems.length,
            normalizedCount,
            duplicateCount,
            verifiedCount,
          },
          "Source poll cycle completed safely in tenant context",
        );

        return {
          sourceId: jobData.sourceId,
          totalFetched: rawItems.length,
          normalizedCount,
          duplicateCount,
          verifiedCount,
          quarantinedCount,
        };
      },
    );
  }
}
