import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * KnowledgeService - CRUD for knowledge_chunks table
 *
 * Internal service only - NOT exposed via API endpoints
 * Handles chunking logic and storage of warehouse knowledge
 */
@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create knowledge chunks for a warehouse
   *
   * Chunking strategy:
   * 1. Overview chunk - basic info (name, location, operator)
   * 2. Inventory chunk - boxes, sizes, pricing
   * 3. Features chunk - amenities, working hours
   * 4. Reviews chunk - aggregated review insights
   */
  async createWarehouseChunks(warehouse: any): Promise<void> {
    const chunks: any[] = [];

    // Chunk 1: Warehouse Overview
    const overviewContent = this.buildOverviewChunk(warehouse);
    chunks.push({
      sourceType: 'warehouse',
      sourceId: String(warehouse.id),
      content: overviewContent,
      metadata: {
        chunkType: 'overview',
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        emirate: warehouse.emirate,
      },
    });

    // Chunk 2: Inventory & Pricing
    if (warehouse.boxes && warehouse.boxes.length > 0) {
      const inventoryContent = this.buildInventoryChunk(warehouse);
      chunks.push({
        sourceType: 'warehouse',
        sourceId: String(warehouse.id),
        content: inventoryContent,
        metadata: {
          chunkType: 'inventory',
          warehouseId: warehouse.id,
          warehouseName: warehouse.name,
          boxCount: warehouse.boxes.length,
        },
      });
    }

    // Chunk 3: Features & Amenities
    const featuresContent = this.buildFeaturesChunk(warehouse);
    chunks.push({
      sourceType: 'warehouse',
      sourceId: String(warehouse.id),
      content: featuresContent,
      metadata: {
        chunkType: 'features',
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
      },
    });

    // Chunk 4: Reviews Summary
    if (warehouse.reviews && warehouse.reviews.length > 0) {
      const reviewsContent = this.buildReviewsChunk(warehouse);
      chunks.push({
        sourceType: 'warehouse',
        sourceId: String(warehouse.id),
        content: reviewsContent,
        metadata: {
          chunkType: 'reviews',
          warehouseId: warehouse.id,
          warehouseName: warehouse.name,
          reviewCount: warehouse.reviews.length,
          avgRating: warehouse.rating,
        },
      });
    }

    // Store all chunks
    for (const chunk of chunks) {
      await this.prisma.knowledgeChunk.create({
        data: chunk,
      });
    }

    this.logger.debug(`Created ${chunks.length} knowledge chunks for warehouse ${warehouse.id}`);
  }

  /**
   * Build overview chunk content
   */
  private buildOverviewChunk(warehouse: any): string {
    const parts = [
      `Warehouse: ${warehouse.name}`,
      `Location: ${warehouse.address}, ${warehouse.district || ''}, ${warehouse.emirate}`,
      `Operator: ${warehouse.operator?.companyName || 'N/A'}`,
    ];

    if (warehouse.description) {
      parts.push(`Description: ${warehouse.description}`);
    }

    parts.push(`Rating: ${warehouse.rating}/5 (${warehouse.reviewCount} reviews)`);
    parts.push(`Status: ${warehouse.status}`);

    return parts.join('\n');
  }

  /**
   * Build inventory & pricing chunk content
   */
  private buildInventoryChunk(warehouse: any): string {
    const parts = [
      `Warehouse: ${warehouse.name}`,
      `Available Storage Units:`,
    ];

    const boxesBySize: Record<string, any[]> = {};
    for (const box of warehouse.boxes) {
      if (!boxesBySize[box.size]) {
        boxesBySize[box.size] = [];
      }
      boxesBySize[box.size].push(box);
    }

    for (const [size, boxes] of Object.entries(boxesBySize)) {
      const availableCount = boxes.filter((b) => b.isAvailable).length;
      const prices = boxes.map((b) => b.priceMonthly.toNumber());
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      let priceRange = `${minPrice} AED/month`;
      if (minPrice !== maxPrice) {
        priceRange = `${minPrice}-${maxPrice} AED/month`;
      }

      parts.push(`- Size ${size}: ${availableCount} available, ${priceRange}`);
    }

    return parts.join('\n');
  }

  /**
   * Build features & amenities chunk content
   */
  private buildFeaturesChunk(warehouse: any): string {
    const parts = [
      `Warehouse: ${warehouse.name}`,
      `Features & Amenities:`,
    ];

    const features: string[] = [];
    if (warehouse.hasClimateControl) features.push('Climate Control');
    if (warehouse.has24x7Access) features.push('24/7 Access');
    if (warehouse.hasSecurityCameras) features.push('Security Cameras');
    if (warehouse.hasInsurance) features.push('Insurance Available');
    if (warehouse.hasParkingSpace) features.push('Parking Space');

    if (features.length > 0) {
      parts.push(`- ${features.join(', ')}`);
    } else {
      parts.push('- No special features listed');
    }

    if (warehouse.contactPhone) {
      parts.push(`Contact: ${warehouse.contactPhone}`);
    }

    if (warehouse.workingHours) {
      parts.push(`Working Hours: ${JSON.stringify(warehouse.workingHours)}`);
    }

    return parts.join('\n');
  }

  /**
   * Build reviews summary chunk content
   */
  private buildReviewsChunk(warehouse: any): string {
    const parts = [
      `Warehouse: ${warehouse.name}`,
      `Customer Reviews (${warehouse.reviewCount} total, ${warehouse.rating}/5 average):`,
    ];

    // Sample recent reviews
    const recentReviews = warehouse.reviews.slice(0, 5);
    for (const review of recentReviews) {
      parts.push(`- ${review.rating}/5: ${review.comment || 'No comment'}`);
    }

    return parts.join('\n');
  }

  /**
   * Delete all knowledge chunks for a warehouse
   */
  async deleteWarehouseChunks(warehouseId: number): Promise<void> {
    await this.prisma.knowledgeChunk.deleteMany({
      where: {
        sourceType: 'warehouse',
        sourceId: String(warehouseId),
      },
    });

    this.logger.debug(`Deleted knowledge chunks for warehouse ${warehouseId}`);
  }

  /**
   * Get all chunks for a warehouse (for debugging)
   */
  async getWarehouseChunks(warehouseId: number) {
    return this.prisma.knowledgeChunk.findMany({
      where: {
        sourceType: 'warehouse',
        sourceId: String(warehouseId),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get chunk by ID
   */
  async getChunkById(id: string) {
    return this.prisma.knowledgeChunk.findUnique({
      where: { id },
    });
  }

  /**
   * Delete chunk by ID
   */
  async deleteChunk(id: string) {
    return this.prisma.knowledgeChunk.delete({
      where: { id },
    });
  }

  /**
   * Get total chunks count
   */
  async getTotalChunksCount() {
    return this.prisma.knowledgeChunk.count();
  }

  /**
   * Get chunks by source type
   */
  async getChunksBySourceType(sourceType: string, limit: number = 100) {
    return this.prisma.knowledgeChunk.findMany({
      where: { sourceType },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}
