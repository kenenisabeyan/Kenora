import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../../modules/auth/auth.service.js";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator.js";

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      if (isPublic) {
        return true;
      }
      throw new UnauthorizedException(
        "AUTH_MISSING_TOKEN: Authorization header required",
      );
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    try {
      const session = await this.authService.validateSession(token);
      request.sessionToken = token;
      request.session = session;
      request.user = session.user;
      request.activeOrganizationId = session.activeOrganization?.id;
      return true;
    } catch (error) {
      if (isPublic) {
        return true;
      }
      throw error;
    }
  }
}
