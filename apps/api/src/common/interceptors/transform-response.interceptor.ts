import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { APIResponse } from "@kenora/types";

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, APIResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<APIResponse<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        // If data is already wrapped with { success: boolean, data: ... }, preserve it
        if (data && typeof data === "object" && "success" in data && "data" in data) {
          return data;
        }

        return {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
            version: "v1",
            correlationId: request.correlationId,
          },
        };
      }),
    );
  }
}
