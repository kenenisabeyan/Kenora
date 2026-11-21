import { SetMetadata } from "@nestjs/common";
import { Permission } from "@kenora/security";

export const PERMISSIONS_KEY = "requiredPermission";
export const RequirePermission = (permission: Permission) =>
  SetMetadata(PERMISSIONS_KEY, permission);
