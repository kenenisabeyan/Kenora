# Kenora Security: Authentication Model

## Overview

Kenora uses a secure server-managed session architecture. Passwords are hashed using bcrypt (12 salt rounds).

## Authentication Flows

- **Registration**: Creates `User`, `Organization`, and assigns `OWNER` role membership.
- **Login**: Verifies credentials, rotates session identifier, and creates `AuthSessionDTO`.
- **Session Validation**: Validates session token, checks expiration, and returns active organization context.
- **Organization Switching**: Validates user membership in target organization before updating active session context.
- **Password Reset**: Cryptographically secure single-use tokens with expiration.

## Security Controls

- **Account Enumeration Defense**: Login and password reset endpoints return generic public error messages.
- **Session Rotation**: Session tokens are rotated on login and password reset.
- **Secret Non-Exposure**: Passwords, tokens, and hashes are omitted from API responses and Pino logs.
