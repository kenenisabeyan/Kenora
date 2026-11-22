import { describe, it, expect, beforeEach } from "vitest";
import { MetricsController } from "./metrics.controller";
import { MetricsCollector } from "@kenora/observability";

describe("MetricsController (NFR Monitoring & Telemetry)", () => {
  let controller: MetricsController;

  beforeEach(() => {
    controller = new MetricsController();
    MetricsCollector.getInstance().clear();
  });

  it("should return plaintext Prometheus format with metrics", () => {
    MetricsCollector.getInstance().incrementCounter("http_requests_total", { route: "/api/v1/health" });
    const output = controller.getPrometheusMetrics();

    expect(typeof output).toBe("string");
    expect(output).toContain("# HELP http_requests_total");
    expect(output).toContain("# TYPE http_requests_total counter");
  });

  it("should return SLA availability metrics object", () => {
    const sla = controller.getSlaMetrics();

    expect(sla).toBeDefined();
    expect(sla.targetSla).toBe("99.99%");
    expect(sla.availabilityPercentage).toBeGreaterThanOrEqual(0);
  });

  it("should return graceful degradation mode and signals", () => {
    const status = controller.getDegradationStatus();

    expect(status).toBeDefined();
    expect(status.mode).toBe("NORMAL_OPERATION");
    expect(status.timestamp).toBeDefined();
  });
});
