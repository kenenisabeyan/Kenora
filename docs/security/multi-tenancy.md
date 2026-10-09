# Kenora Multi-Tenancy & Tenant Isolation Architecture

## 1. Overview
Multi-tenancy is a core security boundary in Kenora. Organization resource isolation is enforced at every layer (Domain, API Services, Database, Workers) to prevent cross-tenant data leakage (IDOR).

---

## 2. Multi-Tenant Execution Model

```text
HTTP Request / Background Job Payload
               ↓
    Server Validates User Session & Active Membership
               ↓
    TenantContext.run({ tenantId: organizationId }, ...)
               ↓
    AsyncLocalStorage Binds Execution Context to Request Scope
               ↓
    Database Queries Filtered by eq(table.organizationId, TenantContext.get())
```

---

## 3. Strict Rules
1. **No Client-Supplied Impersonation:** Request headers (`x-tenant-id`) or URL parameters are never trusted without validating active membership on the server.
2. **Server-Side Context Switching:** Switching active organization context (`POST /auth/switch-organization`) requires server verification that the user holds an active membership in the target organization.
3. **Background Job Security:** Background worker jobs carry `organizationId` explicitly in their job payload and re-establish execution context using `TenantContext.run()`.
