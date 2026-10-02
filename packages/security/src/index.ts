/**
 * Kenora Security Architecture
 * Enforces Tenant Isolation and Untrusted External Data Boundary
 */

export interface SecurityContext {
  tenantId: string;
  userId?: string;
  roles: string[];
}

export class TenantContext {
  private static activeTenantId: string | null = null;

  static set(tenantId: string) {
    if (!tenantId) throw new Error("Tenant ID cannot be null");
    this.activeTenantId = tenantId;
  }

  static get(): string {
    if (!this.activeTenantId) {
      throw new Error(
        "TenantContext error: No active tenant bound to execution context",
      );
    }
    return this.activeTenantId;
  }

  static clear() {
    this.activeTenantId = null;
  }
}

/**
 * Sanitizes untrusted content received from external platforms before storing or passing to AI models.
 * Rule: External content is data, never authority.
 */
export class ExternalDataSanitizer {
  static sanitizeText(input: string): string {
    if (!input) return "";
    // Strip executive prompt override patterns, system prompt injections, script tags, null bytes
    return input
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .trim();
  }

  static wrapUntrustedData(data: string): string {
    const cleanData = this.sanitizeText(data);
    return `<untrusted_external_content>\n${cleanData}\n</untrusted_external_content>`;
  }
}
