import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmbeddingService } from '../embedding.service';
import {
  WarehouseCreatedEvent,
  WarehouseUpdatedEvent,
} from '../../../common/events/warehouse.events';
import { ReviewCreatedEvent } from '../../../common/events/review.events';
import { BoxPriceChangedEvent } from '../../../common/events/box.events';

/**
 * RagIndexListener - Auto-index warehouses for RAG when events occur
 *
 * Listens to warehouse-related events and automatically updates knowledge chunks.
 * All operations are wrapped in try/catch to ensure failures don't break main flow.
 *
 * Events handled:
 * - warehouse.created → index new warehouse
 * - warehouse.updated → reindex warehouse
 * - review.created → reindex warehouse (reviews affect content)
 * - box.price_changed → reindex warehouse (pricing affects content)
 */
@Injectable()
export class RagIndexListener {
  private readonly logger = new Logger(RagIndexListener.name);

  constructor(private readonly embeddingService: EmbeddingService) {}

  /**
   * When warehouse is created, index it for RAG
   */
  @OnEvent('warehouse.created')
  async handleWarehouseCreated(event: WarehouseCreatedEvent) {
    try {
      this.logger.log(`RAG: Indexing new warehouse ${event.warehouseId}`);
      await this.embeddingService.indexWarehouse(event.warehouseId);
    } catch (error) {
      this.logger.error(
        `RAG: Failed to index warehouse ${event.warehouseId}`,
        error.stack,
      );
      // Don't throw - indexing failures must not break main flow
    }
  }

  /**
   * When warehouse is updated, reindex it
   */
  @OnEvent('warehouse.updated')
  async handleWarehouseUpdated(event: WarehouseUpdatedEvent) {
    try {
      this.logger.log(`RAG: Reindexing updated warehouse ${event.warehouseId}`);
      await this.embeddingService.reindexWarehouse(event.warehouseId);
    } catch (error) {
      this.logger.error(
        `RAG: Failed to reindex warehouse ${event.warehouseId}`,
        error.stack,
      );
    }
  }

  /**
   * When review is created, reindex the warehouse
   * Reviews affect the knowledge base content
   */
  @OnEvent('review.created')
  async handleReviewCreated(event: ReviewCreatedEvent) {
    try {
      this.logger.log(
        `RAG: Reindexing warehouse ${event.warehouseId} after new review`,
      );
      await this.embeddingService.reindexWarehouse(event.warehouseId);
    } catch (error) {
      this.logger.error(
        `RAG: Failed to reindex warehouse ${event.warehouseId} after review`,
        error.stack,
      );
    }
  }

  /**
   * When box price changes, reindex the warehouse
   * Pricing information is part of inventory chunk
   */
  @OnEvent('box.price_changed')
  async handleBoxPriceChanged(event: BoxPriceChangedEvent) {
    try {
      this.logger.log(
        `RAG: Reindexing warehouse ${event.warehouseId} after price change`,
      );
      await this.embeddingService.reindexWarehouse(event.warehouseId);
    } catch (error) {
      this.logger.error(
        `RAG: Failed to reindex warehouse ${event.warehouseId} after price change`,
        error.stack,
      );
    }
  }
}
