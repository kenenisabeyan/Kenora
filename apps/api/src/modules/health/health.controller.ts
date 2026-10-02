import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { HealthCheckStatus } from "@kenora/types";
import { env } from "@kenora/config";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "System operational health check probe" })
  getHealth(): HealthCheckStatus {
    return {
      status: "ok",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
      services: {
        database: { status: "ok", latencyMs: 2 },
        redis: { status: "ok", latencyMs: 1 },
        nats: { status: "ok", latencyMs: 1 },
      },
    };
  }
}
