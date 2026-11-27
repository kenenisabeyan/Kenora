/**
 * SLA Latency Monitor & Percentile Budget Tracker
 * Formally verifies production performance against Kenora Whitepaper Targets:
 * P50 <= 45ms, P95 <= 180ms, P99 <= 450ms, Error Rate <= 0.01%
 */

export interface SLABudget {
  p50ThresholdMs: number;
  p95ThresholdMs: number;
  p99ThresholdMs: number;
  maxErrorRatePct: number;
}

export interface SLAPerformanceReport {
  sampleCount: number;
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  errorRatePct: number;
  status: "compliant" | "degraded" | "breached";
  violations: string[];
}

export class SLAMonitor {
  private latencies: number[] = [];
  private totalRequests = 0;
  private totalErrors = 0;
  private readonly budget: SLABudget;

  constructor(customBudget?: Partial<SLABudget>) {
    this.budget = {
      p50ThresholdMs: 45,
      p95ThresholdMs: 180,
      p99ThresholdMs: 450,
      maxErrorRatePct: 0.01,
      ...customBudget,
    };
  }

  recordRequest(latencyMs: number, isError: boolean = false): void {
    this.totalRequests++;
    if (isError) {
      this.totalErrors++;
    }
    this.latencies.push(latencyMs);

    // Keep sliding sample window at max 10,000 requests to bound memory
    if (this.latencies.length > 10000) {
      this.latencies.shift();
    }
  }

  getPercentile(p: number): number {
    if (this.latencies.length === 0) return 0;
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
  }

  generateReport(): SLAPerformanceReport {
    const sampleCount = this.latencies.length;
    const p50Ms = this.getPercentile(50);
    const p90Ms = this.getPercentile(90);
    const p95Ms = this.getPercentile(95);
    const p99Ms = this.getPercentile(99);

    const errorRatePct =
      this.totalRequests > 0
        ? Math.round((this.totalErrors / this.totalRequests) * 10000) / 100
        : 0;

    const violations: string[] = [];

    if (p50Ms > this.budget.p50ThresholdMs) {
      violations.push(`P50 latency (${p50Ms}ms) exceeds SLA target (${this.budget.p50ThresholdMs}ms)`);
    }
    if (p95Ms > this.budget.p95ThresholdMs) {
      violations.push(`P95 latency (${p95Ms}ms) exceeds SLA target (${this.budget.p95ThresholdMs}ms)`);
    }
    if (p99Ms > this.budget.p99ThresholdMs) {
      violations.push(`P99 latency (${p99Ms}ms) exceeds SLA target (${this.budget.p99ThresholdMs}ms)`);
    }
    if (errorRatePct > this.budget.maxErrorRatePct) {
      violations.push(`Error rate (${errorRatePct}%) exceeds maximum tolerance (${this.budget.maxErrorRatePct}%)`);
    }

    let status: "compliant" | "degraded" | "breached" = "compliant";
    if (violations.length > 0) {
      status = violations.length >= 2 || p99Ms > this.budget.p99ThresholdMs * 1.5 ? "breached" : "degraded";
    }

    return {
      sampleCount,
      p50Ms,
      p90Ms,
      p95Ms,
      p99Ms,
      errorRatePct,
      status,
      violations,
    };
  }

  reset(): void {
    this.latencies = [];
    this.totalRequests = 0;
    this.totalErrors = 0;
  }
}
