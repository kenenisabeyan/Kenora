import { Module } from "@nestjs/common";
import { HealthModule } from "./modules/health/health.module.js";
import { SourcesModule } from "./modules/sources/sources.module.js";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { OrganizationsModule } from "./modules/organizations/organizations.module.js";

@Module({
  imports: [
    HealthModule,
    SourcesModule,
    KnowledgeModule,
    AuthModule,
    OrganizationsModule,
  ],
})
export class AppModule {}
