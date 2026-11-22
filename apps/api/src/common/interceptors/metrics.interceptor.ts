import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";
import { MetricsCollector, SlaAvailabilityTracker } from "@kenora/observability";

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private metrics = MetricsCollector.getInstance();
  private static slaTracker = new SlaAvailabilityTracker();

  static getSlaTracker(): SlaAvailabilityTracker {
    return MetricsInterceptor.slaTracker;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const startNs = process.hrtime.bigint();
    const method = req.method;
    const route = req.route?.path || req.path || "unknown";

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Number(process.hrtime.bigint() - startNs) / 1_000_000;
          const status = String(res.statusCode || 200);

          this.metrics.incrementCounter("http_requests_total", {
            method,
            route,
            status,
          });
          this.metrics.observeHistogram("http_request_duration_ms", durationMs, {
            route,
          });
          MetricsInterceptor.slaTracker.recordRequest(res.statusCode < 500);
        },
        error: (err) => {
          const durationMs = Number(process.hrtime.bigint() - startNs) / 1_000_000;
          const status = String(err.status || 500);

          this.metrics.incrementCounter("http_requests_total", {
            method,
            route,
            status,
          });
          this.metrics.observeHistogram("http_request_duration_ms", durationMs, {
            route,
          });
          MetricsInterceptor.slaTracker.recordRequest(false);
        },
      }),
    );
  }
}
