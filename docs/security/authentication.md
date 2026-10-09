# Kenora Authentication Architecture & Security Specifications

## 1. Overview
Kenora implements a server-managed session authentication architecture designed for high security, multi-tenant isolation, and zero secret exposure. Authentication handles identity verification ("Who are you?"), issuing cryptographically secure session tokens, and establishing trusted request execution context.

---

## 2. Authentication Flow

```text
User Request (Email + Password)
          ↓
  Rate Limiter Check (5 req/min)
          ↓
  Password Verification (bcrypt, min 8 chars)
          ↓
  Session Token Generation (crypto.randomBytes 256-bit)
          ↓
  Session State Persistence (Server-Managed Session Store)
          ↓
  Cookie / Authorization Header Return (SameSite=Strict)
```

---

## 3. Account Enumeration Protections
* **Registration & Login:** Generic failure responses (`AUTH_INVALID_CREDENTIALS`) prevent email harvesting.
* **Password Reset:** Initiating password reset for an invalid email address returns generic success ("If an account exists with this email, password reset instructions have been initiated.").

---

## 4. Password Security
* Modern bcrypt hashing algorithm (SALT_ROUNDS = 12 in production/dev, 4 in test environment).
* Passwords are never stored in plaintext, never logged, and never returned in API payloads.

---

## 5. Token Lifecycles & Security Rules
* **Session Tokens:** Prefix `ses_`, 256-bit entropy, 7-day expiration, instant revocation on logout/password change.
* **Verification Tokens:** Single-use 24-hour expiration.
* **Reset Tokens:** Single-use 1-hour expiration.

---

## 6. Rate Limiting
* Sliding window in-memory & Redis rate limiting enforced on `/auth/login`, `/auth/register`, `/auth/forgot-password`.
