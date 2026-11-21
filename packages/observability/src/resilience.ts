/**
 * Enterprise Resilience Utilities: Circuit Breaker & Exponential Backoff with Jitter
 */

export interface CircuitBreakerOptions {
  failureThreshold?: number; // Consecutive failures before opening
  resetTimeoutMs?: number;   // Time to wait before attempting half-open state
}

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 3;
    this.resetTimeoutMs = options.resetTimeoutMs ?? 30000;
  }

  getState(): CircuitState {
    if (
      this.state === "OPEN" &&
      Date.now() - this.lastFailureTime > this.resetTimeoutMs
    ) {
      this.state = "HALF_OPEN";
    }
    return this.state;
  }

  async execute<T>(action: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === "OPEN") {
      throw new Error(
        "CIRCUIT_BREAKER_OPEN: Service unavailable, circuit is currently open",
      );
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
    }
  }

  reset(): void {
    this.state = "CLOSED";
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

export class BackoffRetry {
  /**
   * Executes an asynchronous task with exponential backoff and full random jitter
   */
  static async execute<T>(
    task: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const maxAttempts = options.maxAttempts ?? 3;
    const baseDelayMs = options.baseDelayMs ?? 100;
    const maxDelayMs = options.maxDelayMs ?? 5000;

    let attempt = 0;
    while (attempt < maxAttempts) {
      try {
        return await task();
      } catch (error) {
        attempt++;
        if (attempt >= maxAttempts) {
          throw error;
        }

        // Exponential backoff with full jitter: Uniform(0, min(maxDelay, base * 2^attempt))
        const exponentialDelay = Math.min(
          maxDelayMs,
          baseDelayMs * Math.pow(2, attempt),
        );
        const jitteredDelay = Math.floor(Math.random() * exponentialDelay);

        await new Promise((resolve) => setTimeout(resolve, jitteredDelay));
      }
    }

    throw new Error("RETRY_EXHAUSTED: Maximum retry attempts reached");
  }
}
