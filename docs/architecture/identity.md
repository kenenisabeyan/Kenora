# Kenora Identity & Organization Domain Architecture

## 1. Core Domain Specifications
The Identity architecture models users, organizations, memberships, roles, permissions, and sessions.

```text
User
  ├── Session (activeOrganizationId)
  └── Membership (role: OWNER | ADMIN | MEMBER) ──→ Organization
                                                       ├── Sources
                                                       ├── Knowledge Items
                                                       └── Audit Logs
```

---

## 2. Identifier Strategy
All identity entities use secure UUIDv4 / random string prefixes (`usr-`, `org-`, `mem-`, `ses-`) to prevent object enumeration attacks.

---

## 3. Repositories
Domain repository contracts defined in `@kenora/domain`:
* `IUserRepository`
* `IOrganizationRepository`
* `IMembershipRepository`
* `ISessionRepository`
