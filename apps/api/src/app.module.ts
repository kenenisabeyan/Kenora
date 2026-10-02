import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module.js';
import { SourcesModule } from './modules/sources/sources.module.js';
import { KnowledgeModule } from './modules/knowledge/knowledge.module.js';

@Module({
  imports: [
    HealthModule,
    SourcesModule,
    KnowledgeModule,
  ],
})
export class AppModule {}
