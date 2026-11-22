/**
 * Prometheus & OpenTelemetry Compatible In-Memory Metrics Registry
 * Aligned with Kenora Performance, Observability & Monitoring NFRs
 */

export interface MetricLabels {
  [key: string]: string | number | undefined;
}

export interface MetricSample {
  name: string;
  help: string;
  type: "counter" | "gauge" | "histogram";
  labels: Record<string, string>;
  value: number;
  timestamp: string;
}

export class MetricsCollector {
  private static instance: MetricsCollector;
  private counters = new Map<string, number>(); // key: name + serialized labels
  private gauges = new Map<string, number>();
  private histograms = new Map<string, number[]>(); // values array for p50, p95, p99

  private metricMetadata = new Map<
    string,
    { help: string; type: "counter" | "gauge" | "histogram" }
  >();

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  constructor() {
    this.register("http_requests_total", "Total incoming HTTP requests", "counter");
    this.register("http_request_duration_ms", "HTTP request latency in milliseconds", "histogram");
    this.register("knowledge_ingestion_total", "Total knowledge records ingested", "counter");
    this.register("verification_verdicts_total", "Total verification verdicts processed", "counter");
    this.register("circuit_breaker_trips_total", "Total circuit breaker failure trips", "counter");
    this.register("active_tenants_gauge", "Count of active isolated tenants", "gauge");
    this.register("system_memory_used_bytes", "Resident set size memory footprint", "gauge");
  }

  register(name: string, help: string, type: "counter" | "gauge" | "histogram"): void {
    this.metricMetadata.set(name, { help, type });
  }

  incrementCounter(name: string, labels: MetricLabels = {}, value = 1): void {
    const key = this.serializeKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
  }

  setGauge(name: string, value: number, labels: MetricLabels = {}): void {
    const key = this.serializeKey(name, labels);
    this.gauges.set(key, value);
  }

  observeHistogram(name: string, value: number, labels: MetricLabels = {}): void {
    const key = this.serializeKey(name, labels);
    if (!this.histograms.has(key)) {
      this.histograms.set(key, []);
    }
    const samples = this.histograms.get(key)!;
    samples.push(value);
    // Keep max 1000 rolling samples to maintain low memory overhead
    if (samples.length > 1000) samples.shift();
  }

  getCounter(name: string, labels: MetricLabels = {}): number {
    const key = this.serializeKey(name, labels);
    return this.counters.get(key) || 0;
  }

  getGauge(name: string, labels: MetricLabels = {}): number {
    const key = this.serializeKey(name, labels);
    return this.gauges.get(key) || 0;
  }

  getHistogramPercentiles(
    name: string,
    labels: MetricLabels = {},
  ): { p50: number; p95: number; p99: number; count: number } {
    const key = this.serializeKey(name, labels);
    const samples = [...(this.histograms.get(key) || [])].sort((a, b) => a - b);
    if (samples.length === 0) {
      return { p50: 0, p95: 0, p99: 0, count: 0 };
    }

    const p50 = samples[Math.floor(samples.length * 0.5)];
    const p95 = samples[Math.floor(samples.length * 0.95)];
    const p99 = samples[Math.floor(samples.length * 0.99)] || samples[samples.length - 1];

    return { p50, p95, p99, count: samples.length };
  }

  /**
   * Serializes collected metrics to standard OpenMetrics / Prometheus text exposition format
   */
  exportPrometheusFormat(): string {
    const lines: string[] = [];

    // Counters
    for (const [key, value] of this.counters.entries()) {
      const { name, labelStr } = this.deserializeKey(key);
      const meta = this.metricMetadata.get(name) || { help: name, type: "counter" };
      lines.push(`# HELP ${name} ${meta.help}`);
      lines.push(`# TYPE ${name} ${meta.type}`);
      lines.push(`${name}${labelStr} ${value}`);
    }

    // Gauges
    for (const [key, value] of this.gauges.entries()) {
      const { name, labelStr } = this.deserializeKey(key);
      const meta = this.metricMetadata.get(name) || { help: name, type: "gauge" };
      lines.push(`# HELP ${name} ${meta.help}`);
      lines.push(`# TYPE ${name} ${meta.type}`);
      lines.push(`${name}${labelStr} ${value}`);
    }

    // Histograms
    for (const [key, samples] of this.histograms.entries()) {
      const { name, labelStr } = this.deserializeKey(key);
      const meta = this.metricMetadata.get(name) || { help: name, type: "histogram" };
      const sorted = [...samples].sort((a, b) => a - b);
      const sum = sorted.reduce((acc, v) => acc + v, 0);
      const count = sorted.length;
      lines.push(`# HELP ${name} ${meta.help}`);
      lines.push(`# TYPE ${name} ${meta.type}`);
      lines.push(`${name}_sum${labelStr} ${sum}`);
      lines.push(`${name}_count${labelStr} ${count}`);
    }

    return lines.join("\n") + "\n";
  }

  clear(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }

  private serializeKey(name: string, labels: MetricLabels): string {
    const sortedPairs = Object.entries(labels)
      .filter(([_, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`);
    return `${name}{${sortedPairs.join(",")}}`;
  }

  private deserializeKey(key: string): { name: string; labelStr: string } {
    const braceIdx = key.indexOf("{");
    if (braceIdx === -1) {
      return { name: key, labelStr: "" };
    }
    const name = key.slice(0, braceIdx);
    const labelStr = key.slice(braceIdx);
    return { name, labelStr: labelStr === "{}" ? "" : labelStr };
  }
}
