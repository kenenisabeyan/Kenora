import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service.js";
import { AuthSessionDTO, APIResponse } from "@kenora/types";
import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  SwitchOrgInput,
  ChangePasswordInput,
  VerifyEmailInput,
} from "@kenora/api-contracts";
import { RateLimiter } from "@kenora/security";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register new account and primary organization" })
  async register(
    @Body() input: RegisterInput,
  ): Promise<APIResponse<AuthSessionDTO>> {
    const rateCheck = RateLimiter.isAllowed(
      `reg-${input.email}`,
      5,
      60000,
    );
    if (!rateCheck.allowed) {
      throw new HttpException(
        "AUTH_RATE_LIMITED: Too many registration attempts. Please wait.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const data = await this.authService.register(input);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Post("login")
  @ApiOperation({
    summary: "Authenticate credentials and create secure session",
  })
  async login(@Body() input: LoginInput): Promise<APIResponse<AuthSessionDTO>> {
    const rateCheck = RateLimiter.isAllowed(
      `login-${input.email.toLowerCase()}`,
      5,
      60000,
    );
    if (!rateCheck.allowed) {
      throw new HttpException(
        "AUTH_RATE_LIMITED: Too many login attempts. Please try again later.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const data = await this.authService.login(input);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Get("me")
  @ApiOperation({
    summary: "Get current authenticated user session and active tenant context",
  })
  async me(
    @Headers("authorization") authHeader?: string,
  ): Promise<APIResponse<AuthSessionDTO>> {
    const token = this.extractToken(authHeader);
    const data = await this.authService.validateSession(token);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Post("logout")
  @ApiOperation({ summary: "Invalidate current session" })
  async logout(
    @Headers("authorization") authHeader?: string,
  ): Promise<APIResponse<{ message: string }>> {
    const token = this.extractToken(authHeader);
    await this.authService.logout(token);
    return {
      success: true,
      data: { message: "Logged out successfully" },
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Post("verify-email")
  @ApiOperation({ summary: "Verify email address using secure token" })
  async verifyEmail(
    @Body() input: VerifyEmailInput,
  ): Promise<APIResponse<{ message: string }>> {
    const data = await this.authService.verifyEmail(input.token);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Post("switch-organization")
  @ApiOperation({
    summary: "Switch active organization context safely on server side",
  })
  async switchOrganization(
    @Headers("authorization") authHeader: string | undefined,
    @Body() input: SwitchOrgInput,
  ): Promise<APIResponse<AuthSessionDTO>> {
    const token = this.extractToken(authHeader);
    const data = await this.authService.switchOrganization(
      token,
      input.organizationId,
    );
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Post("change-password")
  @ApiOperation({
    summary: "Change password for authenticated user and revoke other sessions",
  })
  async changePassword(
    @Headers("authorization") authHeader: string | undefined,
    @Body() input: ChangePasswordInput,
  ): Promise<APIResponse<{ message: string }>> {
    const token = this.extractToken(authHeader);
    const data = await this.authService.changePassword(token, input);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Post("forgot-password")
  @ApiOperation({
    summary: "Initiate password reset flow with generic public response",
  })
  async forgotPassword(
    @Body() input: ForgotPasswordInput,
  ): Promise<APIResponse<{ message: string }>> {
    const rateCheck = RateLimiter.isAllowed(
      `forgot-${input.email.toLowerCase()}`,
      3,
      60000,
    );
    if (!rateCheck.allowed) {
      throw new HttpException(
        "AUTH_RATE_LIMITED: Too many password reset requests.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const data = await this.authService.forgotPassword(input);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset password using valid reset token" })
  async resetPassword(
    @Body() input: ResetPasswordInput,
  ): Promise<APIResponse<{ message: string }>> {
    const data = await this.authService.resetPassword(input);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  private extractToken(authHeader?: string): string {
    if (!authHeader) {
      throw new UnauthorizedException(
        "AUTH_MISSING_TOKEN: Authorization header required",
      );
    }
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      return parts[1];
    }
    return authHeader;
  }
}
