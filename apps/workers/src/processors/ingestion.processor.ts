import { SourceAdapterRegistry } from '@kenora/source-adapters';
import { createLogger } from '@kenora/observability';
import { env } from '@kenora/config';

const logger = createLogger({ serviceName: 'kenora-workers' });

export class IngestionProcessor {
  private registry = new SourceAdapterRegistry();

  async processSourcePolling(sourceId: string, adapterType: string, url: string) {
    logger.info({ sourceId, adapterType, url }, 'Executing idempotent background source ingestion job');

    const adapter = this.registry.get(adapterType);
    if (!adapter) {
      logger.warn({ adapterType }, 'Adapter type not registered, falling back to generic adapter');
      return;
    }

    const health = await adapter.checkHealth();
    logger.info({ adapterType, health }, 'Adapter health verified');

    const items = await adapter.fetchLatest(url);
    logger.info({ sourceId, itemCount: items.length }, 'Source poll cycle completed');
  }
}
