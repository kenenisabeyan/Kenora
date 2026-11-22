/**
 * Graceful Degradation Manager & High Availability SLA Tracker
 * Mandated by Kenora Availability, Reliability & Fault Tolerance NFRs
 */

export type OperationalHealthMode =
  | "NORMAL_OPERATION"       // Full capabilities (PGVector, Redis, LLMs live)
  | "DEGRADED_FALLBACK"     // Partial outages (Fallback to BM25 lexical search, in-memory cache)
  | "EMERGENCY_READ_ONLY";  // Storage disconnected; serving static cached intelligence

export interface ServiceHealthSignal {
  service: string;
  isUp: boolean;
  latencyMs: number;
  lastCheckedAt: string;
  error?: string;
}

export class GracefulDegradationManager {
  private static instance: GracefulDegradationManager;
  private services = new Map<string, ServiceHealthSignal>();
  private currentMode: OperationalHealthMode = "NORMAL_OPERATION";

  static getInstance(): GracefulDegradationManager {
    if (!GracefulDegradationManager.instance) {
      GracefulDegradationManager.instance = new GracefulDegradationManager();
    }
    return GracefulDegradationManager.instance;
  }

  recordSignal(signal: ServiceHealthSignal): void {
    this.services.set(signal.service, signal);
    this.recomputeMode();
  }

  getMode(): OperationalHealthMode {
    return this.currentMode;
  }

  getServicesStatus(): ServiceHealthSignal[] {
    return Array.from(this.services.values());
  }

  /**
   * Evaluates downstream health signals to determine current operational degradation level
   */
  private recomputeMode(): void {
    const signals = Array.from(this.services.values());
    const downCount = signals.filter((s) => !s.isUp).length;

    if (downCount === 0) {
      this.currentMode = "NORMAL_OPERATION";
    } else if (downCount === 1) {
      // Single subsystem degradation (e.g., Vector DB down -> fall back to Lexical BM25)
      this.currentMode = "DEGRADED_FALLBACK";
    } else {
      // Multiple subsystems down -> protect data consistency in read-only mode
      this.currentMode = "EMERGENCY_READ_ONLY";
    }
  }

  clear(): void {
    this.services.clear();
    this.currentMode = "NORMAL_OPERATION";
  }
}

/**
 * 99.99% Availability & SLA Sliding-Window Calculator
 */
export class SlaAvailabilityTracker {
  private totalRequests = 0;
  private successfulRequests = 0;
  private failedRequests = 0;
  private startTime = Date.now();

  recordRequest(isSuccess: boolean): void {
    this.totalRequests++;
    if (isSuccess) {
      this.successfulRequests++;
    } else {
      this.failedRequests++;
    }
  }

  getAvailabilityPercentage(): number {
    if (this.totalRequests === 0) return 100.0;
    const ratio = (this.successfulRequests / this.totalRequests) * 100;
    return Math.round(ratio * 1000) / 1000; // 3 decimal places
  }

  getMetrics(): {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    availabilityPercentage: number;
    targetSla: string;
    meetsSla: boolean;
    uptimeSeconds: number;
  } {
    const availability = this.getAvailabilityPercentage();
    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      availabilityPercentage: availability,
      targetSla: "99.99%",
      meetsSla: availability >= 99.99,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  reset(): void {
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.startTime = Date.now();
  }
}
