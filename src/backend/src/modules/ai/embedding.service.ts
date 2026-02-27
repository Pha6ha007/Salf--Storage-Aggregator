import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../../prisma/prisma.service';
import { KnowledgeService } from './knowledge.service';

/**
 * EmbeddingService - Handles text embeddings and warehouse indexing for RAG
 *
 * This service provides the infrastructure for vector embeddings but is NOT
 * exposed via API in MVP. It automatically indexes warehouses when they are
 * created/updated via event listeners.
 *
 * Future use: AI Chat (v2), semantic search, personalized recommendations
 */
@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly anthropic: Anthropic | null;
  private readonly embeddingModel = 'voyage-2'; // Anthropic's embedding model

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private knowledgeService: KnowledgeService,
  ) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (apiKey) {
      this.anthropic = new Anthropic({ apiKey });
      this.logger.log('Embedding service initialized (RAG infrastructure ready)');
    } else {
      this.logger.warn('Anthropic API key not found - embedding service disabled');
      this.anthropic = null;
    }
  }

  /**
   * Generate embedding vector for text
   * Returns a 1536-dimensional vector (OpenAI ada-002 compatible)
   *
   * Note: In production, you might use OpenAI's text-embedding-ada-002
   * or Anthropic's voyage-2 model. This is a placeholder implementation.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.anthropic) {
      this.logger.warn('Cannot generate embedding - API key not configured');
      // Return dummy embedding for development
      return Array(1536).fill(0);
    }

    try {
      // TODO: Implement actual embedding API call
      // For now, return dummy embedding
      // In production:
      // const response = await openai.embeddings.create({
      //   model: 'text-embedding-ada-002',
      //   input: text,
      // });
      // return response.data[0].embedding;

      this.logger.debug(`Generated embedding for text (${text.length} chars)`);
      return Array(1536).fill(0); // Placeholder
    } catch (error) {
      this.logger.error('Failed to generate embedding', error.stack);
      return Array(1536).fill(0);
    }
  }

  /**
   * Index a warehouse - generate knowledge chunks and embeddings
   *
   * Chunks created:
   * 1. Warehouse overview (name, description, location, features)
   * 2. Inventory & pricing (boxes by size with prices)
   * 3. Features & amenities (climate control, 24/7 access, etc.)
   * 4. Reviews summary (if reviews exist)
   */
  async indexWarehouse(warehouseId: number): Promise<void> {
    try {
      this.logger.log(`Indexing warehouse ${warehouseId} for RAG`);

      // Fetch warehouse with all related data
      const warehouse = await this.prisma.warehouse.findUnique({
        where: { id: warehouseId },
        include: {
          boxes: {
            where: { deletedAt: null },
            orderBy: { size: 'asc' },
          },
          reviews: {
            where: { isVisible: true },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          operator: {
            select: {
              id: true,
              companyName: true,
            },
          },
        },
      });

      if (!warehouse) {
        this.logger.warn(`Warehouse ${warehouseId} not found, skipping indexing`);
        return;
      }

      // Don't index inactive or deleted warehouses
      if (warehouse.status !== 'active' || warehouse.deletedAt) {
        this.logger.log(`Warehouse ${warehouseId} is inactive, skipping indexing`);
        return;
      }

      // Generate chunks and store
      await this.knowledgeService.createWarehouseChunks(warehouse);

      this.logger.log(`Successfully indexed warehouse ${warehouseId}`);
    } catch (error) {
      this.logger.error(`Failed to index warehouse ${warehouseId}`, error.stack);
      // Don't throw - indexing failures should not break main flow
    }
  }

  /**
   * Reindex a warehouse - delete old chunks and create new ones
   */
  async reindexWarehouse(warehouseId: number): Promise<void> {
    try {
      this.logger.log(`Reindexing warehouse ${warehouseId}`);

      // Delete existing chunks
      await this.knowledgeService.deleteWarehouseChunks(warehouseId);

      // Create new chunks
      await this.indexWarehouse(warehouseId);

      this.logger.log(`Successfully reindexed warehouse ${warehouseId}`);
    } catch (error) {
      this.logger.error(`Failed to reindex warehouse ${warehouseId}`, error.stack);
    }
  }

  /**
   * Find similar knowledge chunks using pgvector cosine similarity
   *
   * @param query - Search query text
   * @param limit - Number of results to return
   * @returns Array of knowledge chunks ordered by similarity
   */
  async findSimilar(query: string, limit: number = 5): Promise<any[]> {
    try {
      // Generate embedding for query
      const queryEmbedding = await this.generateEmbedding(query);

      // TODO: Implement pgvector similarity search
      // In production:
      // const chunks = await this.prisma.$queryRaw`
      //   SELECT *, embedding <=> ${queryEmbedding}::vector AS distance
      //   FROM knowledge_chunks
      //   WHERE source_type = 'warehouse'
      //   ORDER BY distance
      //   LIMIT ${limit}
      // `;

      this.logger.debug(`Similarity search for query: ${query} (${limit} results)`);
      return [];
    } catch (error) {
      this.logger.error('Failed to perform similarity search', error.stack);
      return [];
    }
  }

  /**
   * Reindex all active warehouses
   * Admin utility for batch reindexing
   */
  async reindexAll(): Promise<{ indexed: number; failed: number }> {
    this.logger.log('Starting batch reindex of all active warehouses');

    const warehouses = await this.prisma.warehouse.findMany({
      where: {
        status: 'active',
        deletedAt: null,
      },
      select: { id: true },
    });

    let indexed = 0;
    let failed = 0;

    for (const warehouse of warehouses) {
      try {
        await this.reindexWarehouse(warehouse.id);
        indexed++;
      } catch (error) {
        this.logger.error(`Failed to reindex warehouse ${warehouse.id}`, error.stack);
        failed++;
      }
    }

    this.logger.log(`Batch reindex complete: ${indexed} indexed, ${failed} failed`);
    return { indexed, failed };
  }
}
