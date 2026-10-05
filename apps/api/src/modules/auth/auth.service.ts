import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import {
  PasswordHasher,
  DevelopmentEmailService,
  IEmailService,
} from "@kenora/security";
import {
  UserDTO,
  OrganizationDTO,
  MembershipDTO,
  AuthSessionDTO,
} from "@kenora/types";
import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from "@kenora/api-contracts";
import crypto from "node:crypto";

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  isEmailVerified: boolean;
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
}

interface StoredOrg {
  id: string;
  name: string;
  slug: string;
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
}

interface StoredMembership {
  id: string;
  userId: string;
  organizationId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: "active" | "invited";
  createdAt: string;
  updatedAt: string;
}

interface StoredSession {
  sessionId: string;
  userId: string;
  activeOrganizationId?: string;
  sessionToken: string;
  expiresAt: string;
  revokedAt?: string;
  createdAt: string;
}

@Injectable()
export class AuthService {
  private emailService: IEmailService = new DevelopmentEmailService();
  private users = new Map<string, StoredUser>();
  private organizations = new Map<string, StoredOrg>();
  private memberships: StoredMembership[] = [];
  private sessions = new Map<string, StoredSession>();
  private resetTokens = new Map<
    string,
    { userId: string; expiresAt: string; used: boolean }
  >();
  private verificationTokens = new Map<
    string,
    { userId: string; expiresAt: string; used: boolean }
  >();

  async register(input: RegisterInput): Promise<AuthSessionDTO> {
    const existingUser = Array.from(this.users.values()).find(
      (u) => u.email === input.email.toLowerCase(),
    );
    if (existingUser) {
      throw new BadRequestException(
        "AUTH_EMAIL_EXISTS: An account with this email address already exists",
      );
    }

    const userId = `usr-${crypto.randomUUID()}`;
    const passwordHash = await PasswordHasher.hash(input.password);

    const newUser: StoredUser = {
      id: userId,
      email: input.email.toLowerCase(),
      passwordHash,
      name: input.name,
      isEmailVerified: false,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(userId, newUser);

    // Create Initial Organization
    const orgId = `org-${crypto.randomUUID()}`;
    const slug = input.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    const newOrg: StoredOrg = {
      id: orgId,
      name: input.organizationName,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.organizations.set(orgId, newOrg);

    // Create Owner Membership
    const membershipId = `mem-${crypto.randomUUID()}`;
    const newMembership: StoredMembership = {
      id: membershipId,
      userId,
      organizationId: orgId,
      role: "OWNER",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memberships.push(newMembership);

    // Send Verification Email via EmailService Abstraction
    const vToken = crypto.randomBytes(32).toString("hex");
    this.verificationTokens.set(vToken, {
      userId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      used: false,
    });

    await this.emailService.sendEmail({
      to: newUser.email,
      subject: "Verify your Kenora Account",
      template: "email_verification",
      variables: { token: vToken },
    });

    // Create Initial Session
    return this.createSession(newUser, orgId);
  }

  async login(input: LoginInput): Promise<AuthSessionDTO> {
    const user = Array.from(this.users.values()).find(
      (u) => u.email === input.email.toLowerCase(),
    );

    // Account enumeration protection: Generic failure
    if (!user) {
      throw new UnauthorizedException(
        "AUTH_INVALID_CREDENTIALS: Invalid email or password credentials",
      );
    }

    const isValidPassword = await PasswordHasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException(
        "AUTH_INVALID_CREDENTIALS: Invalid email or password credentials",
      );
    }

    const userMemberships = this.memberships.filter(
      (m) => m.userId === user.id && m.status === "active",
    );
    const primaryOrgId =
      userMemberships.length > 0
        ? userMemberships[0].organizationId
        : undefined;

    return this.createSession(user, primaryOrgId);
  }

  async createSession(
    user: StoredUser,
    activeOrgId?: string,
  ): Promise<AuthSessionDTO> {
    const sessionToken = `ses_${crypto.randomBytes(32).toString("hex")}`;
    const sessionId = `sid-${crypto.randomUUID()}`;
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const storedSession: StoredSession = {
      sessionId,
      userId: user.id,
      activeOrganizationId: activeOrgId,
      sessionToken,
      expiresAt,
      createdAt: new Date().toISOString(),
    };
    this.sessions.set(sessionToken, storedSession);

    const userMemberships = this.memberships.filter(
      (m) => m.userId === user.id && m.status === "active",
    );
    const activeOrg = activeOrgId
      ? this.organizations.get(activeOrgId)
      : undefined;

    return {
      sessionId: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      activeOrganization: activeOrg,
      memberships: userMemberships,
      expiresAt,
    };
  }

  async validateSession(sessionToken: string): Promise<AuthSessionDTO> {
    const session = this.sessions.get(sessionToken);
    if (
      !session ||
      session.revokedAt ||
      new Date(session.expiresAt) < new Date()
    ) {
      throw new UnauthorizedException(
        "AUTH_SESSION_EXPIRED: Session invalid or expired",
      );
    }

    const user = this.users.get(session.userId);
    if (!user || user.status !== "active") {
      throw new UnauthorizedException(
        "AUTH_UNAUTHORIZED: Account disabled or not found",
      );
    }

    const userMemberships = this.memberships.filter(
      (m) => m.userId === user.id && m.status === "active",
    );
    const activeOrg = session.activeOrganizationId
      ? this.organizations.get(session.activeOrganizationId)
      : undefined;

    return {
      sessionId: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      activeOrganization: activeOrg,
      memberships: userMemberships,
      expiresAt: session.expiresAt,
    };
  }

  async logout(sessionToken: string): Promise<void> {
    const session = this.sessions.get(sessionToken);
    if (session) {
      session.revokedAt = new Date().toISOString();
      this.sessions.set(sessionToken, session);
    }
  }

  async switchOrganization(
    sessionToken: string,
    targetOrgId: string,
  ): Promise<AuthSessionDTO> {
    const currentSession = await this.validateSession(sessionToken);

    const isMember = currentSession.memberships.some(
      (m) => m.organizationId === targetOrgId,
    );
    if (!isMember) {
      throw new BadRequestException(
        "ORG_MEMBERSHIP_REQUIRED: User is not an active member of requested organization",
      );
    }

    const session = this.sessions.get(sessionToken)!;
    session.activeOrganizationId = targetOrgId;
    this.sessions.set(sessionToken, session);

    return this.validateSession(sessionToken);
  }

  async changePassword(
    sessionToken: string,
    input: ChangePasswordInput,
  ): Promise<{ message: string }> {
    const sessionDto = await this.validateSession(sessionToken);
    const user = this.users.get(sessionDto.user.id)!;

    const isValidCurrent = await PasswordHasher.compare(
      input.currentPassword,
      user.passwordHash,
    );
    if (!isValidCurrent) {
      throw new UnauthorizedException(
        "AUTH_INVALID_CREDENTIALS: Current password is incorrect",
      );
    }

    user.passwordHash = await PasswordHasher.hash(input.newPassword);
    user.updatedAt = new Date().toISOString();

    // Revoke all other active sessions except current
    for (const [t, s] of this.sessions.entries()) {
      if (s.userId === user.id && t !== sessionToken) {
        s.revokedAt = new Date().toISOString();
      }
    }

    return {
      message:
        "Password changed successfully. All other active sessions have been revoked.",
    };
  }

  async forgotPassword(
    input: ForgotPasswordInput,
  ): Promise<{ message: string }> {
    const user = Array.from(this.users.values()).find(
      (u) => u.email === input.email.toLowerCase(),
    );
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      this.resetTokens.set(resetToken, {
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        used: false,
      });

      await this.emailService.sendEmail({
        to: user.email,
        subject: "Reset your Kenora Password",
        template: "password_reset",
        variables: { token: resetToken },
      });
    }
    return {
      message:
        "If an account exists with this email, password reset instructions have been initiated.",
    };
  }

  async resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
    const tokenRecord = this.resetTokens.get(input.token);
    if (
      !tokenRecord ||
      tokenRecord.used ||
      new Date(tokenRecord.expiresAt) < new Date()
    ) {
      throw new BadRequestException(
        "AUTH_INVALID_TOKEN: Reset token invalid or expired",
      );
    }

    const user = this.users.get(tokenRecord.userId);
    if (!user) {
      throw new BadRequestException("AUTH_USER_NOT_FOUND");
    }

    user.passwordHash = await PasswordHasher.hash(input.newPassword);
    tokenRecord.used = true;

    for (const [t, s] of this.sessions.entries()) {
      if (s.userId === user.id) {
        s.revokedAt = new Date().toISOString();
      }
    }

    return {
      message:
        "Password reset successful. Please log in with your new password.",
    };
  }
}
