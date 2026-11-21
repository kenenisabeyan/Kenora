import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDTO } from "@kenora/types";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserDTO | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
