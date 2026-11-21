import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response, Request } from "express";
import { createLogger } from "@kenora/observability";

const logger = createLogger({ serviceName: "kenora-api" });

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { correlationId?: string }>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: "Internal server error" };

    const message =
      typeof exceptionResponse === "string"
        ? exceptionResponse
        : (exceptionResponse as any).message ||
          (exception as any)?.message ||
          "An unexpected error occurred";

    const errorCode =
      typeof message === "string" && message.includes(":")
        ? message.split(":")[0].trim()
        : (exceptionResponse as any).error || "INTERNAL_ERROR";

    if (status >= 500) {
      logger.error(
        {
          err: exception,
          path: request.url,
          correlationId: request.correlationId,
        },
        "Unhandled Server Exception",
      );
    }

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message,
        statusCode: status,
      },
      meta: {
        timestamp: new Date().toISOString(),
        correlationId: request.correlationId || request.headers["x-correlation-id"],
        path: request.url,
      },
    });
  }
}
