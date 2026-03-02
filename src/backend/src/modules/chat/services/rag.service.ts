import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export interface RagContext {
  chunks: string[];
  sources: string[];
}

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Search knowledge base for relevant context
   * MVP: Simple fulltext search in knowledge_chunks
   * Future: Vector similarity search with embeddings
   */
  async searchContext(query: string, limit: number = 5): Promise<RagContext> {
    try {
      // Normalize query for search
      const normalizedQuery = query.toLowerCase().trim();

      // Search knowledge chunks using fulltext search
      // For MVP, we'll use PostgreSQL's LIKE for simple matching
      // Future: Use pgvector for semantic search
      const chunks = await this.prisma.knowledgeChunk.findMany({
        where: {
          OR: [
            {
              content: {
                contains: normalizedQuery,
                mode: 'insensitive',
              },
            },
            // Also search in metadata if it contains searchable text
            {
              metadata: {
                path: ['tags'],
                array_contains: [normalizedQuery],
              },
            },
          ],
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (chunks.length === 0) {
        this.logger.debug(`No knowledge chunks found for query: ${query}`);
        return {
          chunks: [],
          sources: [],
        };
      }

      this.logger.debug(
        `Found ${chunks.length} knowledge chunks for query: ${query}`,
      );

      return {
        chunks: chunks.map((chunk) => chunk.content),
        sources: chunks.map((chunk) => chunk.sourceType),
      };
    } catch (error) {
      this.logger.error('Error searching knowledge base:', error);
      return {
        chunks: [],
        sources: [],
      };
    }
  }

  /**
   * Get FAQ context (common questions)
   */
  async getFaqContext(): Promise<string[]> {
    try {
      const faqChunks = await this.prisma.knowledgeChunk.findMany({
        where: {
          sourceType: 'faq',
        },
        take: 20,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return faqChunks.map((chunk) => chunk.content);
    } catch (error) {
      this.logger.error('Error fetching FAQ context:', error);
      return [];
    }
  }

  /**
   * Build context string for Claude prompt
   */
  buildContextString(ragContext: RagContext): string {
    if (ragContext.chunks.length === 0) {
      return 'No specific context available. Provide general guidance and suggest browsing the catalog.';
    }

    let contextStr = 'CONTEXT (from knowledge base):\n\n';

    ragContext.chunks.forEach((chunk, index) => {
      contextStr += `[${index + 1}] ${chunk}\n\n`;
    });

    return contextStr;
  }
}
