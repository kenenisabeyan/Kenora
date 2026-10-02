# Kenora Security: Multi-Tenancy & Tenant Isolation

## Multi-Tenancy Security Boundary

Kenora enforces multi-tenancy at three distinct layers:

1. **AsyncLocalStorage Context Propagation**: Requests and worker jobs run within `TenantContext.run({ tenantId })`.
2. **Database Query Isolation**: Every organization-owned table contains `organization_id` foreign key indexed in PostgreSQL.
3. **Authorization Check**: `AuthorizationService.can()` asserts that `activeOrgId === resource.organizationId`.

Client-side headers (`x-tenant-id`) or parameters are NEVER trusted without server session membership verification.
