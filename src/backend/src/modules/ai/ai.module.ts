import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { EmbeddingService } from './embedding.service';
import { KnowledgeService } from './knowledge.service';
import { RagIndexListener } from './listeners/rag-index.listener';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [
    AiService,
    KnowledgeService, // First - no dependencies
    EmbeddingService, // Second - depends on KnowledgeService
    RagIndexListener, // Third - depends on EmbeddingService
  ],
  exports: [AiService, EmbeddingService, KnowledgeService],
})
export class AiModule {}
