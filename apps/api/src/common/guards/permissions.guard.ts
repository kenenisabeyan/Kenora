import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthorizationService, Permission } from "@kenora/security";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator.js";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<Permission>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session || !session.memberships) {
      throw new ForbiddenException(
        "ORG_MEMBERSHIP_REQUIRED: No active authenticated session found",
      );
    }

    const targetOrgId = request.params?.id || request.activeOrganizationId;

    if (!targetOrgId) {
      throw new ForbiddenException(
        "ORG_CONTEXT_MISSING: No organization target resolved for permission verification",
      );
    }

    const callerMembership = session.memberships.find(
      (m: any) => m.organizationId === targetOrgId,
    );

    if (!callerMembership) {
      throw new ForbiddenException(
        "ORG_MEMBERSHIP_REQUIRED: Caller is not a member of target organization",
      );
    }

    AuthorizationService.authorize(
      callerMembership.role,
      requiredPermission,
      targetOrgId,
      { organizationId: targetOrgId },
    );

    return true;
  }
}
