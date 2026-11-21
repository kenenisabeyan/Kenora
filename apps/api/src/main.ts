import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { createLogger } from "@kenora/observability";
import { env } from "@kenora/config";
import {
  GlobalExceptionFilter,
  TenantContextInterceptor,
  TransformResponseInterceptor,
} from "./common/index.js";

const logger = createLogger({ serviceName: "kenora-api" });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.enableCors();
  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new TenantContextInterceptor(),
    new TransformResponseInterceptor(),
  );

  const config = new DocumentBuilder()
    .setTitle("Kenora API Platform")
    .setDescription(
      "Professional Knowledge & Intelligence Infrastructure REST API",
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = env.PORT || 4000;
  await app.listen(port);
  logger.info(
    `🚀 Kenora API Platform running on port ${port} [http://localhost:${port}/api/v1]`,
  );
  logger.info(
    `📚 Swagger OpenAPI documentation available at http://localhost:${port}/docs`,
  );
}

bootstrap().catch((err) => {
  logger.fatal(err, "Failed to start Kenora API");
  process.exit(1);
});
