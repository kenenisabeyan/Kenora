import { describe, it, expect } from "vitest";
import { TenantContext, ExternalDataSanitizer } from "./index.js";

describe("Security Primitives", () => {
  it("should set and get TenantContext correctly", () => {
    TenantContext.set("tenant-123");
    expect(TenantContext.get()).toBe("tenant-123");
    TenantContext.clear();
  });

  it("should throw error when accessing unset TenantContext", () => {
    TenantContext.clear();
    expect(() => TenantContext.get()).toThrow("TenantContext error");
  });

  it("should sanitize untrusted external content and strip script tags", () => {
    const maliciousInput = 'Hello <script>alert("hacked")</script> World';
    const sanitized = ExternalDataSanitizer.sanitizeText(maliciousInput);
    expect(sanitized).toBe("Hello  World");
  });

  it("should wrap untrusted content in XML boundary tags", () => {
    const input = "External web data";
    const wrapped = ExternalDataSanitizer.wrapUntrustedData(input);
    expect(wrapped).toContain("<untrusted_external_content>");
    expect(wrapped).toContain("External web data");
  });
});
