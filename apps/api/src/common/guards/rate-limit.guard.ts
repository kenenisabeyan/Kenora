import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RateLimiter } from "@kenora/security";
import {
  RATE_LIMIT_KEY,
  RateLimitOptions,
} from "../decorators/rate-limit.decorator.js";

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    let key: string;

    if (options.keyExtractor) {
      key = options.keyExtractor(request);
    } else if (request.body?.email) {
      key = `${options.keyPrefix || "rt"}-${request.body.email.toLowerCase().trim()}`;
    } else {
      key = `${options.keyPrefix || "rt"}-${request.ip || "unknown"}`;
    }

    const check = RateLimiter.isAllowed(key, options.limit, options.windowMs);
    if (!check.allowed) {
      throw new HttpException(
        "AUTH_RATE_LIMITED: Too many requests. Please wait.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
