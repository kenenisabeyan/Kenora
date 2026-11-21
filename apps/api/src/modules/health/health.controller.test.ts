import { describe, it, expect } from "vitest";
import { HealthController } from "./health.controller.js";

describe("HealthController & Cloud Probing", () => {
  it("should return operational health check status", () => {
    const controller = new HealthController();
    const result = controller.getHealth();
    expect(result.status).toBe("ok");
    expect(result.version).toBe("0.1.0");
    expect(result.services.database.status).toBe("ok");
  });

  it("should return valid liveness probe status", () => {
    const controller = new HealthController();
    const liveness = controller.getLiveness();
    expect(liveness.status).toBe("ok");
    expect(liveness.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it("should return valid readiness probe status", () => {
    const controller = new HealthController();
    const readiness = controller.getReadiness();
    expect(readiness.ready).toBe(true);
    expect(readiness.checks.databasePool).toBe(true);
  });
});
