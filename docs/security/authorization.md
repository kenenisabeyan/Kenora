# Kenora Centralized Authorization Service & RBAC Specifications

## 1. Overview
Authorization in Kenora is decoupled from authentication and tenant isolation. It answers: *"What are you allowed to do within this active organization context?"*

---

## 2. Authorization Flow

```text
Authenticated Request
          ↓
   Extract User Identity & Active Organization Context
          ↓
   Resolve User Membership & Assigned Role (OWNER | ADMIN | MEMBER)
          ↓
   Evaluate Action against RolePermissionMatrix
          ↓
   Verify Target Resource Belongs to Active Organization
          ↓
   Grant or Deny Access (AUTH_FORBIDDEN)
```

---

## 3. Role-Based Access Control (RBAC) Matrix

| Role | Organization Read/Update | Member Invite/Update | Project & Knowledge CRUD | Memory & Agent Execute |
| :--- | :---: | :---: | :---: | :---: |
| **OWNER** | Allowed | Allowed | Allowed | Allowed |
| **ADMIN** | Allowed | Allowed | Allowed | Allowed |
| **MEMBER** | Read-Only | Read-Only | Read-Only | Read-Only |

---

## 4. Centralized Enforcement
All permissions are authorized via `AuthorizationService.can()` or `AuthorizationService.authorize()` in `@kenora/security`. Controllers never write inline `if (role === "ADMIN")` checks.
