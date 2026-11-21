import { describe, it, expect } from "vitest";
import { TenantContextInterceptor } from "./tenant-context.interceptor.js";
import { TenantContext } from "@kenora/security";
import { of, lastValueFrom } from "rxjs";

describe("TenantContextInterceptor", () => {
  it("should bind tenant and correlationId to AsyncLocalStorage execution context", async () => {
    const interceptor = new TenantContextInterceptor();
    const mockRequest: any = {
      activeOrganizationId: "org-test-777",
      headers: {
        "x-correlation-id": "corr-12345",
      },
    };

    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    };

    let capturedTenant: string | undefined;
    let capturedCorrelationId: string | undefined;

    const mockCallHandler = {
      handle: () => {
        capturedTenant = TenantContext.get();
        capturedCorrelationId = TenantContext.getStore()?.correlationId;
        return of({ result: "ok" });
      },
    };

    const stream$ = interceptor.intercept(mockContext, mockCallHandler);
    const result = await lastValueFrom(stream$);

    expect(result).toEqual({ result: "ok" });
    expect(capturedTenant).toBe("org-test-777");
    expect(capturedCorrelationId).toBe("corr-12345");
  });
});
