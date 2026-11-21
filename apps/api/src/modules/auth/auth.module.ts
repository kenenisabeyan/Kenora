import { Global, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import {
  SessionAuthGuard,
  PermissionsGuard,
  RateLimitGuard,
} from "../../common/index.js";

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, SessionAuthGuard, PermissionsGuard, RateLimitGuard],
  exports: [AuthService, SessionAuthGuard, PermissionsGuard, RateLimitGuard],
})
export class AuthModule {}
