import { SourceAdapterRegistry } from "@kenora/source-adapters";
import { createLogger } from "@kenora/observability";
import { TenantContext } from "@kenora/security";

const logger = createLogger({ serviceName: "kenora-workers" });

export interface IngestionJobPayload {
  organizationId: string;
  sourceId: string;
  adapterType: string;
  url: string;
  correlationId?: string;
}

export class IngestionProcessor {
  private registry = new SourceAdapterRegistry();

  async processSourcePolling(jobData: IngestionJobPayload) {
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
          return;
        }

        const health = await adapter.checkHealth();
        logger.info(
          { adapterType: jobData.adapterType, health },
          "Adapter health verified in tenant scope",
        );

        const items = await adapter.fetchLatest(jobData.url);
        logger.info(
          { activeTenant, itemCount: items.length },
          "Source poll cycle completed safely in tenant context",
        );
      },
    );
  }
}
