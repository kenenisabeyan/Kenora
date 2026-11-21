import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthSessionDTO } from "@kenora/types";

export const CurrentSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthSessionDTO | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
  },
);
