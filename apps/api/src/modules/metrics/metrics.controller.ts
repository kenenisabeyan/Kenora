import { Controller, Get, Header } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  MetricsCollector,
  GracefulDegradationManager,
} from "@kenora/observability";
import { MetricsInterceptor } from "../../common/interceptors/metrics.interceptor.js";
import { Public } from "../../common/decorators/public.decorator.js";

@ApiTags("metrics")
@Controller("metrics")
export class MetricsController {
  private metrics = MetricsCollector.getInstance();
  private degradationManager = GracefulDegradationManager.getInstance();

  @Get()
  @Public()
  @Header("Content-Type", "text/plain; version=0.0.4; charset=utf-8")
  @ApiOperation({
    summary: "Prometheus / OpenMetrics Exporter",
    description: "Emits standard plaintext Prometheus exposition metrics for scraping.",
  })
  @ApiResponse({ status: 200, description: "Prometheus metrics exported successfully" })
  getPrometheusMetrics(): string {
    return this.metrics.exportPrometheusFormat();
  }

  @Get("sla")
  @Public()
  @ApiOperation({
    summary: "System High Availability & 99.99% SLA Metrics",
    description: "Returns uptime and real-time request availability percentage against 99.99% SLA.",
  })
  getSlaMetrics() {
    return MetricsInterceptor.getSlaTracker().getMetrics();
  }

  @Get("degradation")
  @Public()
  @ApiOperation({
    summary: "Graceful Degradation & Subsystem Health Signals",
    description: "Reports operational degradation status (NORMAL_OPERATION, DEGRADED_FALLBACK, EMERGENCY_READ_ONLY).",
  })
  getDegradationStatus() {
    return {
      mode: this.degradationManager.getMode(),
      subsystems: this.degradationManager.getServicesStatus(),
      timestamp: new Date().toISOString(),
    };
  }
}
