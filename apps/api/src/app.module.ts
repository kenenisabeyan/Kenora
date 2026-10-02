import { Module } from "@nestjs/common";
import { HealthModule } from "./modules/health/health.module.js";
import { SourcesModule } from "./modules/sources/sources.module.js";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";

@Module({
  imports: [HealthModule, SourcesModule, KnowledgeModule, AuthModule],
})
export class AppModule {}
