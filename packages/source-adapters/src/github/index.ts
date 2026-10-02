import {
  ISourceAdapter,
  SourceCapabilities,
  SourceHealth,
  SourceItem,
} from "../core/source-adapter.js";

export class GitHubSourceAdapter implements ISourceAdapter {
  readonly adapterType = "github";

  getCapabilities(): SourceCapabilities {
    return {
      supportsRealtime: true,
      supportsHistoricalBackfill: true,
      supportsFullText: true,
      rateLimitPerMinute: 60,
    };
  }

  async checkHealth(): Promise<SourceHealth> {
    return { status: "healthy", lastCheckedAt: new Date().toISOString() };
  }

  async fetchLatest(sourceUrl: string, since?: Date): Promise<SourceItem[]> {
    // Adapter execution skeleton for GitHub API (releases, commits, discussions)
    return [];
  }
}
