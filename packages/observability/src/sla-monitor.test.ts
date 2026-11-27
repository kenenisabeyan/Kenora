import { describe, it, expect } from "vitest";
import { SLAMonitor } from "./sla-monitor";

describe("SLAMonitor (Latency SLA & Performance Budget Tracker)", () => {
  it("should evaluate a compliant workload meeting all SLA thresholds", () => {
    const monitor = new SLAMonitor();

    // Simulate 100 requests with latencies between 5ms and 35ms (well within P50 45ms, P95 180ms)
    for (let i = 1; i <= 100; i++) {
      monitor.recordRequest(10 + (i % 25), false);
    }

    const report = monitor.generateReport();
    expect(report.status).toBe("compliant");
    expect(report.p50Ms).toBeLessThanOrEqual(45);
    expect(report.p95Ms).toBeLessThanOrEqual(180);
    expect(report.p99Ms).toBeLessThanOrEqual(450);
    expect(report.violations).toHaveLength(0);
  });

  it("should detect degraded and breached SLA when tail latencies spike", () => {
    const monitor = new SLAMonitor();

    // Simulate 90 fast requests (20ms) and 10 extreme spike requests (600ms)
    for (let i = 0; i < 90; i++) monitor.recordRequest(20);
    for (let i = 0; i < 10; i++) monitor.recordRequest(600);

    const report = monitor.generateReport();
    expect(report.status).toBe("breached");
    expect(report.p95Ms).toBe(600);
    expect(report.p99Ms).toBe(600);
    expect(report.violations.length).toBeGreaterThan(0);
  });
});
