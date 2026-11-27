/**
 * Single-Flight Request Coalescing Engine
 * Deduplicates and coalesces identical concurrent asynchronous calls into a single execution.
 * Mitigates cache stampedes, thundering herds, and downstream thread exhaustion.
 */
export interface SingleFlightStats {
  totalCalls: number;
  coalescedCalls: number;
  activeInFlight: number;
}

export class SingleFlightGroup {
  private inFlight = new Map<string, Promise<unknown>>();
  private totalCalls = 0;
  private coalescedCalls = 0;

  /**
   * Executes or joins an in-flight promise identified by the unique key.
   */
  async do<T>(key: string, fn: () => Promise<T>): Promise<T> {
    this.totalCalls++;

    const existing = this.inFlight.get(key) as Promise<T> | undefined;
    if (existing) {
      this.coalescedCalls++;
      return existing;
    }

    const promise = (async () => {
      try {
        return await fn();
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise as Promise<unknown>);
    return promise;
  }

  getStats(): SingleFlightStats {
    return {
      totalCalls: this.totalCalls,
      coalescedCalls: this.coalescedCalls,
      activeInFlight: this.inFlight.size,
    };
  }

  resetStats(): void {
    this.totalCalls = 0;
    this.coalescedCalls = 0;
  }
}
