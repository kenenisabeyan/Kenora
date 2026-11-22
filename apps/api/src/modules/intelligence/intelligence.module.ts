import { Module } from "@nestjs/common";
import { IntelligenceController } from "./intelligence.controller.js";
import { IntelligenceService } from "./intelligence.service.js";
import { KnowledgeModule } from "../knowledge/knowledge.module.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
  imports: [KnowledgeModule, AuthModule],
  controllers: [IntelligenceController],
  providers: [IntelligenceService],
  exports: [IntelligenceService],
})
export class IntelligenceModule {}
