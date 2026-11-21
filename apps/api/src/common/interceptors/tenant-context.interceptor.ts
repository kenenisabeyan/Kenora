import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { TenantContext } from "@kenora/security";
import crypto from "node:crypto";

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tenantId =
      request.activeOrganizationId ||
      request.headers["x-tenant-id"] ||
      "tenant-default";

    const correlationId =
      request.headers["x-correlation-id"] || `req-${crypto.randomUUID()}`;
    request.correlationId = correlationId;

    return new Observable((subscriber) => {
      TenantContext.run(
        {
          tenantId: String(tenantId),
          userId: request.user?.id,
          correlationId: String(correlationId),
        },
        () => {
          next.handle().subscribe({
            next: (val) => subscriber.next(val),
            error: (err) => subscriber.error(err),
            complete: () => subscriber.complete(),
          });
        },
      );
    });
  }
}
