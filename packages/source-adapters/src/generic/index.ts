import {
  ISourceAdapter,
  SourceCapabilities,
  SourceHealth,
  SourceItem,
} from "../core/source-adapter.js";

export class GenericWebAdapter implements ISourceAdapter {
  readonly adapterType = "generic";

  getCapabilities(): SourceCapabilities {
    return {
      supportsRealtime: false,
      supportsHistoricalBackfill: false,
      supportsFullText: true,
      rateLimitPerMinute: 30,
    };
  }

  async checkHealth(): Promise<SourceHealth> {
    return { status: "healthy", lastCheckedAt: new Date().toISOString() };
  }

  async fetchLatest(sourceUrl: string, since?: Date): Promise<SourceItem[]> {
    return [];
  }
}
