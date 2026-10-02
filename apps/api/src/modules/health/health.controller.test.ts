import { describe, it, expect } from "vitest";
import { HealthController } from "./health.controller.js";

describe("HealthController", () => {
  it("should return operational health check status", () => {
    const controller = new HealthController();
    const result = controller.getHealth();
    expect(result.status).toBe("ok");
    expect(result.version).toBe("0.1.0");
    expect(result.services.database.status).toBe("ok");
  });
});
