import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RagService } from '../services/rag.service';

/**
 * RagIndexListener
 *
 * Automatically indexes warehouse data into knowledge base
 * when warehouses are created, updated, or deleted.
 *
 * Events listened to:
 * - warehouse.created
 * - warehouse.updated
 * - warehouse.status_changed
 * - warehouse.deleted
 * - review.created (reindex warehouse with new review)
 */
@Injectable()
export class RagIndexListener {
  private readonly logger = new Logger(RagIndexListener.name);

  constructor(private readonly ragService: RagService) {}

  /**
   * Index warehouse when created
   */
  @OnEvent('warehouse.created', { async: true })
  async handleWarehouseCreated(payload: {
    warehouseId: string;
    operatorId: string;
  }): Promise<void> {
    try {
      this.logger.log(
        `Indexing new warehouse: ${payload.warehouseId}`,
      );
      await this.ragService.indexWarehouse(payload.warehouseId);
    } catch (error) {
      // NEVER throw - listeners should not break the main flow
      this.logger.error(
        `Failed to index warehouse ${payload.warehouseId}:`,
        error,
      );
    }
  }

  /**
   * Reindex warehouse when updated
   */
  @OnEvent('warehouse.updated', { async: true })
  async handleWarehouseUpdated(payload: {
    warehouseId: string;
    operatorId: string;
    changes: Record<string, any>;
  }): Promise<void> {
    try {
      // Only reindex if meaningful fields changed
      const indexableFields = [
        'name',
        'description',
        'address',
        'district',
        'emirate',
        'features',
        'phoneNumber',
        'email',
      ];

      const shouldReindex = Object.keys(payload.changes).some((field) =>
        indexableFields.includes(field),
      );

      if (shouldReindex) {
        this.logger.log(
          `Reindexing updated warehouse: ${payload.warehouseId}`,
        );
        await this.ragService.indexWarehouse(payload.warehouseId);
      } else {
        this.logger.debug(
          `Skipping reindex for warehouse ${payload.warehouseId} - no indexable fields changed`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to reindex warehouse ${payload.warehouseId}:`,
        error,
      );
    }
  }

  /**
   * Handle warehouse status changes
   * - If status changed to 'active': index warehouse
   * - If status changed from 'active': remove from index
   */
  @OnEvent('warehouse.status_changed', { async: true })
  async handleWarehouseStatusChanged(payload: {
    warehouseId: string;
    oldStatus: string;
    newStatus: string;
  }): Promise<void> {
    try {
      if (payload.newStatus === 'active' && payload.oldStatus !== 'active') {
        // Warehouse became active - index it
        this.logger.log(
          `Indexing activated warehouse: ${payload.warehouseId}`,
        );
        await this.ragService.indexWarehouse(payload.warehouseId);
      } else if (
        payload.oldStatus === 'active' &&
        payload.newStatus !== 'active'
      ) {
        // Warehouse deactivated - remove from index
        this.logger.log(
          `Removing deactivated warehouse from index: ${payload.warehouseId}`,
        );
        await this.ragService.removeWarehouseIndex(payload.warehouseId);
      }
    } catch (error) {
      this.logger.error(
        `Failed to handle status change for warehouse ${payload.warehouseId}:`,
        error,
      );
    }
  }

  /**
   * Remove warehouse from index when deleted
   */
  @OnEvent('warehouse.deleted', { async: true })
  async handleWarehouseDeleted(payload: {
    warehouseId: string;
  }): Promise<void> {
    try {
      this.logger.log(
        `Removing deleted warehouse from index: ${payload.warehouseId}`,
      );
      await this.ragService.removeWarehouseIndex(payload.warehouseId);
    } catch (error) {
      this.logger.error(
        `Failed to remove warehouse ${payload.warehouseId} from index:`,
        error,
      );
    }
  }

  /**
   * Reindex warehouse when new review is created
   * (to include latest reviews in search context)
   */
  @OnEvent('review.created', { async: true })
  async handleReviewCreated(payload: {
    reviewId: number;
    warehouseId: string;
    userId: string;
    rating: number;
  }): Promise<void> {
    try {
      this.logger.log(
        `Reindexing warehouse after new review: ${payload.warehouseId}`,
      );
      await this.ragService.indexWarehouse(payload.warehouseId);
    } catch (error) {
      this.logger.error(
        `Failed to reindex warehouse ${payload.warehouseId} after review:`,
        error,
      );
    }
  }
}
