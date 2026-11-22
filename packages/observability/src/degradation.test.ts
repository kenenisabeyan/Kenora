import { describe, it, expect, beforeEach } from "vitest";
import { GracefulDegradationManager, SlaAvailabilityTracker } from "./degradation";

describe("Graceful Degradation Manager", () => {
  let manager: GracefulDegradationManager;

  beforeEach(() => {
    manager = new GracefulDegradationManager();
    manager.clear();
  });

  it("should report NORMAL_OPERATION when all subsystems are healthy", () => {
    manager.recordSignal({ service: "postgres", isUp: true, latencyMs: 2, lastCheckedAt: new Date().toISOString() });
    manager.recordSignal({ service: "redis", isUp: true, latencyMs: 1, lastCheckedAt: new Date().toISOString() });

    expect(manager.getMode()).toBe("NORMAL_OPERATION");
  });

  it("should switch to DEGRADED_FALLBACK when a single subsystem degrades", () => {
    manager.recordSignal({ service: "postgres", isUp: true, latencyMs: 2, lastCheckedAt: new Date().toISOString() });
    manager.recordSignal({ service: "pgvector", isUp: false, latencyMs: 0, lastCheckedAt: new Date().toISOString(), error: "timeout" });

    expect(manager.getMode()).toBe("DEGRADED_FALLBACK");
  });

  it("should switch to EMERGENCY_READ_ONLY when multiple subsystems fail", () => {
    manager.recordSignal({ service: "postgres", isUp: false, latencyMs: 0, lastCheckedAt: new Date().toISOString() });
    manager.recordSignal({ service: "redis", isUp: false, latencyMs: 0, lastCheckedAt: new Date().toISOString() });

    expect(manager.getMode()).toBe("EMERGENCY_READ_ONLY");
  });
});

describe("SLA Availability Tracker (99.99% Compliance)", () => {
  let tracker: SlaAvailabilityTracker;

  beforeEach(() => {
    tracker = new SlaAvailabilityTracker();
    tracker.reset();
  });

  it("should calculate availability percentage and verify 99.99% SLA targets", () => {
    // 10,000 requests, 1 failure -> 99.99% availability
    for (let i = 0; i < 9999; i++) {
      tracker.recordRequest(true);
    }
    tracker.recordRequest(false);

    const metrics = tracker.getMetrics();
    expect(metrics.totalRequests).toBe(10000);
    expect(metrics.successfulRequests).toBe(9999);
    expect(metrics.failedRequests).toBe(1);
    expect(metrics.availabilityPercentage).toBe(99.99);
    expect(metrics.meetsSla).toBe(true);
  });
});
