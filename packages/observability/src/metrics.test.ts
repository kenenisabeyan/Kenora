import { describe, it, expect, beforeEach } from "vitest";
import { MetricsCollector } from "./metrics";

describe("MetricsCollector (Prometheus & OpenMetrics Exposition)", () => {
  let collector: MetricsCollector;

  beforeEach(() => {
    collector = new MetricsCollector();
    collector.clear();
  });

  it("should increment counters and observe histograms", () => {
    collector.incrementCounter("http_requests_total", { method: "GET", status: "200" });
    collector.incrementCounter("http_requests_total", { method: "GET", status: "200" });
    collector.incrementCounter("http_requests_total", { method: "POST", status: "201" });

    expect(collector.getCounter("http_requests_total", { method: "GET", status: "200" })).toBe(2);
    expect(collector.getCounter("http_requests_total", { method: "POST", status: "201" })).toBe(1);

    collector.observeHistogram("http_request_duration_ms", 12, { route: "/api/v1/health" });
    collector.observeHistogram("http_request_duration_ms", 18, { route: "/api/v1/health" });
    collector.observeHistogram("http_request_duration_ms", 45, { route: "/api/v1/health" });

    const percentiles = collector.getHistogramPercentiles("http_request_duration_ms", { route: "/api/v1/health" });
    expect(percentiles.count).toBe(3);
    expect(percentiles.p50).toBe(18);
  });

  it("should export standard Prometheus exposition text format", () => {
    collector.incrementCounter("knowledge_ingestion_total", { adapter: "arxiv" }, 5);
    collector.setGauge("active_tenants_gauge", 42);

    const exported = collector.exportPrometheusFormat();

    expect(exported).toContain("# HELP knowledge_ingestion_total");
    expect(exported).toContain('# TYPE knowledge_ingestion_total counter');
    expect(exported).toContain('knowledge_ingestion_total{adapter="arxiv"} 5');
    expect(exported).toContain("active_tenants_gauge 42");
  });
});
