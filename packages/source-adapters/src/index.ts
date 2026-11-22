export * from "./core/source-adapter.js";
export * from "./github/index.js";
export * from "./generic/index.js";
export * from "./arxiv/index.js";
export * from "./nvd/index.js";
export * from "./rss/index.js";

import { ISourceAdapter } from "./core/source-adapter.js";
import { GitHubSourceAdapter } from "./github/index.js";
import { GenericWebAdapter } from "./generic/index.js";
import { ArxivSourceAdapter } from "./arxiv/index.js";
import { NvdAdvisorySourceAdapter } from "./nvd/index.js";
import { RssFeedAdapter } from "./rss/index.js";

export class SourceAdapterRegistry {
  private adapters = new Map<string, ISourceAdapter>();

  constructor() {
    this.register(new GitHubSourceAdapter());
    this.register(new GenericWebAdapter());
    this.register(new ArxivSourceAdapter());
    this.register(new NvdAdvisorySourceAdapter());
    this.register(new RssFeedAdapter());
  }

  register(adapter: ISourceAdapter) {
    this.adapters.set(adapter.adapterType, adapter);
  }

  get(adapterType: string): ISourceAdapter | undefined {
    return this.adapters.get(adapterType);
  }

  listRegisteredTypes(): string[] {
    return Array.from(this.adapters.keys());
  }
}
