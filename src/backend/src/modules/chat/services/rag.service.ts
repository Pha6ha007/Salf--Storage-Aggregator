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
   * Enhanced: Uses PostgreSQL's pg_trgm for similarity search
   * Falls back to simple ILIKE if pg_trgm fails
   */
  async searchContext(query: string, limit: number = 5): Promise<RagContext> {
    try {
      // Normalize query for search
      const normalizedQuery = query.toLowerCase().trim();

      // Extract keywords from query (split by spaces, filter out short words)
      const keywords = normalizedQuery
        .split(/\s+/)
        .filter((word) => word.length > 2);

      if (keywords.length === 0) {
        return { chunks: [], sources: [] };
      }

      // Try pg_trgm similarity search first (requires pg_trgm extension)
      try {
        const chunks = await this.prisma.$queryRaw<
          Array<{ id: string; content: string; source_type: string }>
        >`
          SELECT id, content, source_type
          FROM knowledge_chunks
          WHERE similarity(content, ${normalizedQuery}) > 0.1
          ORDER BY similarity(content, ${normalizedQuery}) DESC
          LIMIT ${limit}
        `;

        if (chunks.length > 0) {
          this.logger.debug(
            `Found ${chunks.length} chunks via similarity search for: ${query}`,
          );
          return {
            chunks: chunks.map((c) => c.content),
            sources: chunks.map((c) => c.source_type),
          };
        }
      } catch (error) {
        // pg_trgm might not be enabled, fall back to keyword search
        this.logger.debug('pg_trgm similarity search failed, using keyword search');
      }

      // Fallback: Keyword-based search with OR conditions
      const whereConditions = keywords.map((keyword) => ({
        content: {
          contains: keyword,
          mode: 'insensitive' as const,
        },
      }));

      const chunks = await this.prisma.knowledgeChunk.findMany({
        where: {
          OR: whereConditions,
        },
        take: limit * 2, // Get more to rank by keyword count
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Rank chunks by number of keyword matches
      const rankedChunks = chunks
        .map((chunk) => {
          const contentLower = chunk.content.toLowerCase();
          const matchCount = keywords.filter((kw) =>
            contentLower.includes(kw),
          ).length;
          return { chunk, matchCount };
        })
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, limit)
        .map((item) => item.chunk);

      if (rankedChunks.length === 0) {
        this.logger.debug(`No knowledge chunks found for query: ${query}`);
        return { chunks: [], sources: [] };
      }

      this.logger.debug(
        `Found ${rankedChunks.length} chunks via keyword search for: ${query}`,
      );

      return {
        chunks: rankedChunks.map((chunk) => chunk.content),
        sources: rankedChunks.map((chunk) => chunk.sourceType),
      };
    } catch (error) {
      this.logger.error('Error searching knowledge base:', error);
      return { chunks: [], sources: [] };
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

  /**
   * Index warehouse data into knowledge chunks
   * Called by RagIndexListener on warehouse create/update
   */
  async indexWarehouse(warehouseId: number | string): Promise<void> {
    try {
      // Convert string ID to number if needed
      const id = typeof warehouseId === 'string' ? parseInt(warehouseId, 10) : warehouseId;

      // Get warehouse basic data
      const warehouse = await this.prisma.warehouse.findUnique({
        where: { id },
      });

      if (!warehouse) {
        this.logger.warn(`Warehouse ${warehouseId} not found for indexing`);
        return;
      }

      // Don't index inactive warehouses
      if (!warehouse.isActive) {
        this.logger.debug(
          `Skipping inactive warehouse ${warehouseId} (isActive: false)`,
        );
        return;
      }

      // Delete existing chunks for this warehouse
      await this.prisma.knowledgeChunk.deleteMany({
        where: {
          sourceType: 'warehouse',
          sourceId: id.toString(),
        },
      });

      // Build comprehensive warehouse description
      const chunks: string[] = [];

      // Main description chunk
      let mainChunk = `${warehouse.name} - Storage facility in ${warehouse.district || ''}, ${warehouse.emirate}\n`;
      mainChunk += `Location: ${warehouse.address || 'Address not provided'}\n`;
      if (warehouse.description) {
        mainChunk += `Description: ${warehouse.description}\n`;
      }

      chunks.push(mainChunk);

      // TODO: Add boxes and reviews indexing after schema clarification
      // For now, index basic warehouse info only to avoid TypeScript issues

      // Create knowledge chunks
      for (const content of chunks) {
        await this.prisma.knowledgeChunk.create({
          data: {
            sourceType: 'warehouse',
            sourceId: id.toString(),
            content,
            metadata: {
              warehouseName: warehouse.name,
              emirate: warehouse.emirate,
              district: warehouse.district || null,
              indexed_at: new Date().toISOString(),
            },
          },
        });
      }

      this.logger.log(
        `Indexed ${chunks.length} chunks for warehouse: ${warehouse.name}`,
      );
    } catch (error) {
      this.logger.error(
        `Error indexing warehouse ${warehouseId}:`,
        error,
      );
    }
  }

  /**
   * Remove warehouse from knowledge base
   */
  async removeWarehouseIndex(warehouseId: number | string): Promise<void> {
    try {
      const id = typeof warehouseId === 'string' ? warehouseId : warehouseId.toString();
      await this.prisma.knowledgeChunk.deleteMany({
        where: {
          sourceType: 'warehouse',
          sourceId: id,
        },
      });
      this.logger.log(`Removed warehouse ${warehouseId} from knowledge base`);
    } catch (error) {
      this.logger.error(
        `Error removing warehouse index ${warehouseId}:`,
        error,
      );
    }
  }

  /**
   * Batch index all active warehouses
   * Used for initial seeding or full reindex
   */
  async reindexAllWarehouses(): Promise<number> {
    try {
      const warehouses = await this.prisma.warehouse.findMany({
        where: { isActive: true },
        select: { id: true },
      });

      this.logger.log(`Starting reindex of ${warehouses.length} warehouses...`);

      let indexed = 0;
      for (const warehouse of warehouses) {
        await this.indexWarehouse(warehouse.id);
        indexed++;
      }

      this.logger.log(`Reindexed ${indexed} warehouses successfully`);
      return indexed;
    } catch (error) {
      this.logger.error('Error during warehouse reindex:', error);
      throw error;
    }
  }
}
