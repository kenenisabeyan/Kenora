import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Headers,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
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
import {
  Public,
  RateLimit,
  RateLimitGuard,
  SessionAuthGuard,
  CurrentSession,
} from "../../common/index.js";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(RateLimitGuard)
  @RateLimit({ keyPrefix: "reg", limit: 5, windowMs: 60000 })
  @Post("register")
  @ApiOperation({ summary: "Register new account and primary organization" })
  async register(
    @Body() input: RegisterInput,
  ): Promise<APIResponse<AuthSessionDTO>> {
    const data = await this.authService.register(input);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Public()
  @UseGuards(RateLimitGuard)
  @RateLimit({ keyPrefix: "login", limit: 5, windowMs: 60000 })
  @Post("login")
  @ApiOperation({
    summary: "Authenticate credentials and create secure session",
  })
  async login(@Body() input: LoginInput): Promise<APIResponse<AuthSessionDTO>> {
    const data = await this.authService.login(input);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @Get("me")
  @ApiOperation({
    summary: "Get current authenticated user session and active tenant context",
  })
  async me(
    @CurrentSession() session: AuthSessionDTO,
  ): Promise<APIResponse<AuthSessionDTO>> {
    return {
      success: true,
      data: session,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @Post("logout")
  @ApiOperation({ summary: "Invalidate current session" })
  async logout(
    @CurrentSession() session: AuthSessionDTO,
  ): Promise<APIResponse<{ message: string }>> {
    await this.authService.logout(session.sessionId);
    return {
      success: true,
      data: { message: "Logged out successfully" },
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Public()
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

  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @Post("switch-organization")
  @ApiOperation({
    summary: "Switch active organization context safely on server side",
  })
  async switchOrganization(
    @CurrentSession() session: AuthSessionDTO,
    @Body() input: SwitchOrgInput,
  ): Promise<APIResponse<AuthSessionDTO>> {
    const data = await this.authService.switchOrganization(
      session.sessionId,
      input.organizationId,
    );
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  @Post("change-password")
  @ApiOperation({
    summary: "Change password for authenticated user and revoke other sessions",
  })
  async changePassword(
    @CurrentSession() session: AuthSessionDTO,
    @Body() input: ChangePasswordInput,
  ): Promise<APIResponse<{ message: string }>> {
    const data = await this.authService.changePassword(
      session.sessionId,
      input,
    );
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Public()
  @UseGuards(RateLimitGuard)
  @RateLimit({ keyPrefix: "forgot", limit: 3, windowMs: 60000 })
  @Post("forgot-password")
  @ApiOperation({
    summary: "Initiate password reset flow with generic public response",
  })
  async forgotPassword(
    @Body() input: ForgotPasswordInput,
  ): Promise<APIResponse<{ message: string }>> {
    const data = await this.authService.forgotPassword(input);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Public()
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
}
