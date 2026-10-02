/**
 * Provider-Agnostic Model Gateway Interface & Embedding Provider Abstraction
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface LLMCompletionResult {
  text: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ILLMProvider {
  readonly providerName: string;
  complete(
    messages: LLMMessage[],
    options?: LLMCompletionOptions,
  ): Promise<LLMCompletionResult>;
}

export interface IEmbeddingProvider {
  readonly providerName: string;
  readonly dimensions: number;
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

export class ModelGateway {
  private providers = new Map<string, ILLMProvider>();
  private defaultProvider?: string;

  registerProvider(provider: ILLMProvider, isDefault = false) {
    this.providers.set(provider.providerName, provider);
    if (isDefault || !this.defaultProvider) {
      this.defaultProvider = provider.providerName;
    }
  }

  getProvider(name?: string): ILLMProvider {
    const target = name || this.defaultProvider;
    if (!target || !this.providers.has(target)) {
      throw new Error(`ModelGateway error: Provider '${target}' not found`);
    }
    return this.providers.get(target)!;
  }
}
