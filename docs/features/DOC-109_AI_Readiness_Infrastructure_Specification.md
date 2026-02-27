# AI-Readiness Infrastructure Specification
# DOC-109: Event Bus + Activity Logging + Search Logging + RAG Auto-Index

**Version:** 1.0
**Status:** 🟢 Ready for Implementation
**Scope:** MVP v1 (infrastructure only, no AI endpoints beyond Box Finder)
**Purpose:** Prepare data collection and event architecture for future AI features

---

## 1. Purpose & Rationale

### Why build this in MVP?

AI features planned for v1.1-v2 (Chat Assistant, Search Ranking, Price Recommendation,
Fraud Detection) ALL require historical data to function. Without logging from day one,
these features will have 0 training data when you're ready to build them.

**Cost now:** ~2-3 hours implementation (4 small additions)
**Cost of NOT doing it:** 3-6 month data gap when AI features are needed

### What this document covers

| Component | Purpose | Future AI consumer |
|-----------|---------|-------------------|
| **Event Bus** | Decouple modules, enable async listeners | All AI modules |
| **Activity Log** | Record all user/operator actions | Search Ranking, Recommendations |
| **Search Log** | Record search queries + results + clicks | AI Search Ranking (DOC-075) |
| **RAG Auto-Index** | Keep knowledge base current | AI Chat Assistant (DOC-007) |

### What this document does NOT cover

- AI Chat API endpoint (post-MVP)
- ML model training pipelines (post-MVP)
- Real-time analytics dashboard (post-MVP)
- Search ranking algorithm (DOC-075, post-MVP)

---

## 2. Component 1: Internal Event Bus

### 2.1. Technology

NestJS built-in `@nestjs/event-emitter` (based on EventEmitter2).
No external message broker needed for MVP. Upgrade to Redis pub/sub or
RabbitMQ when horizontal scaling is required (post-MVP).

### 2.2. Installation

```bash
npm install @nestjs/event-emitter
```

```typescript
// app.module.ts
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,          // Enable 'booking.*' patterns
      maxListeners: 20,
      verboseMemoryLeak: true,
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

### 2.3. Event Catalog

Every domain event follows the pattern: `{domain}.{action}`

#### Booking Events
```typescript
// src/common/events/booking.events.ts
export class BookingCreatedEvent {
  constructor(
    public readonly bookingId: number,
    public readonly userId: number,
    public readonly warehouseId: number,
    public readonly boxId: number,
    public readonly priceTotal: number,
    public readonly startDate: Date,
    public readonly durationMonths: number,
  ) {}
}

export class BookingConfirmedEvent {
  constructor(
    public readonly bookingId: number,
    public readonly operatorId: number,
  ) {}
}

export class BookingCancelledEvent {
  constructor(
    public readonly bookingId: number,
    public readonly cancelledBy: 'user' | 'operator' | 'system',
    public readonly cancelReason: string,
  ) {}
}

export class BookingCompletedEvent {
  constructor(
    public readonly bookingId: number,
  ) {}
}

export class BookingExpiredEvent {
  constructor(
    public readonly bookingId: number,
  ) {}
}
```

#### Warehouse Events
```typescript
// src/common/events/warehouse.events.ts
export class WarehouseCreatedEvent {
  constructor(
    public readonly warehouseId: number,
    public readonly operatorId: number,
  ) {}
}

export class WarehouseUpdatedEvent {
  constructor(
    public readonly warehouseId: number,
    public readonly changes: Record<string, any>,
  ) {}
}

export class WarehouseStatusChangedEvent {
  constructor(
    public readonly warehouseId: number,
    public readonly oldStatus: string,
    public readonly newStatus: string,
  ) {}
}
```

#### Box Events
```typescript
// src/common/events/box.events.ts
export class BoxCreatedEvent {
  constructor(
    public readonly boxId: number,
    public readonly warehouseId: number,
  ) {}
}

export class BoxPriceChangedEvent {
  constructor(
    public readonly boxId: number,
    public readonly warehouseId: number,
    public readonly oldPrice: number,
    public readonly newPrice: number,
  ) {}
}
```

#### User Events
```typescript
// src/common/events/user.events.ts
export class UserRegisteredEvent {
  constructor(
    public readonly userId: number,
    public readonly role: string,
  ) {}
}

export class UserSearchedEvent {
  constructor(
    public readonly userId: number | null,  // null for anonymous
    public readonly sessionId: string,
    public readonly query: string,
    public readonly filters: Record<string, any>,
    public readonly resultsCount: number,
    public readonly responseTimeMs: number,
  ) {}
}

export class UserViewedWarehouseEvent {
  constructor(
    public readonly userId: number | null,
    public readonly sessionId: string,
    public readonly warehouseId: number,
    public readonly source: 'search' | 'direct' | 'favorites' | 'recommendation',
  ) {}
}
```

#### Review Events
```typescript
// src/common/events/review.events.ts
export class ReviewCreatedEvent {
  constructor(
    public readonly reviewId: number,
    public readonly warehouseId: number,
    public readonly userId: number,
    public readonly rating: number,
  ) {}
}
```

#### CRM Events
```typescript
// src/common/events/crm.events.ts
export class LeadCreatedEvent {
  constructor(
    public readonly leadId: number,
    public readonly source: string,
  ) {}
}

export class LeadStatusChangedEvent {
  constructor(
    public readonly leadId: number,
    public readonly oldStatus: string,
    public readonly newStatus: string,
  ) {}
}
```

### 2.4. Emitting Events (in existing services)

Add to each service — emit AFTER the database transaction succeeds:

```typescript
// bookings.service.ts
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BookingsService {
  constructor(
    private eventEmitter: EventEmitter2,
    // ... other deps
  ) {}

  async create(dto: CreateBookingDto, userId: number) {
    const booking = await this.prisma.booking.create({ ... });
    
    // Emit event AFTER successful creation
    this.eventEmitter.emit('booking.created', new BookingCreatedEvent(
      booking.id, userId, booking.warehouseId, booking.boxId,
      booking.priceTotal, booking.startDate, booking.durationMonths,
    ));
    
    return booking;
  }

  async confirm(bookingId: number, operatorId: number) {
    const booking = await this.prisma.booking.update({ ... });
    
    this.eventEmitter.emit('booking.confirmed', new BookingConfirmedEvent(
      booking.id, operatorId,
    ));
    
    return booking;
  }
  // ... same pattern for cancel, complete, expire
}
```

### 2.5. Listening to Events

```typescript
// Example: Notifications module listens to booking events
@Injectable()
export class NotificationListener {
  @OnEvent('booking.created')
  async handleBookingCreated(event: BookingCreatedEvent) {
    await this.notificationService.sendBookingConfirmationEmail(event.bookingId);
  }

  @OnEvent('booking.confirmed')
  async handleBookingConfirmed(event: BookingConfirmedEvent) {
    await this.notificationService.sendBookingApprovedEmail(event.bookingId);
  }
}

// Example: RAG auto-index listens to warehouse events
@Injectable()
export class RagIndexListener {
  @OnEvent('warehouse.created')
  @OnEvent('warehouse.updated')
  async handleWarehouseChange(event: WarehouseCreatedEvent | WarehouseUpdatedEvent) {
    await this.embeddingService.indexWarehouse(event.warehouseId);
  }

  @OnEvent('review.created')
  async handleReviewCreated(event: ReviewCreatedEvent) {
    // Re-index warehouse to include new review data
    await this.embeddingService.indexWarehouse(event.warehouseId);
  }
}
```

### 2.6. Event Bus Rules

1. **Events are fire-and-forget.** Listener failures MUST NOT break the main flow.
2. **Wrap listeners in try/catch.** Log errors, don't throw.
3. **Events carry IDs, not full objects.** Listeners fetch fresh data if needed.
4. **Emit AFTER the transaction.** Never emit before DB commit.
5. **Keep events immutable.** Use readonly properties.

---

## 3. Component 2: Activity Log

### 3.1. Purpose

Record every significant user and operator action for:
- Future AI training data (search ranking, recommendations)
- Analytics and reporting
- Audit trail
- Debugging

### 3.2. Database Table

Uses the existing `events_log` table from the DB specification.
Add a new `search_logs` table for search-specific data.

```prisma
// Addition to schema.prisma

model SearchLog {
  id              Int      @id @default(autoincrement())
  userId          Int?     @map("user_id")
  sessionId       String   @map("session_id") @db.VarChar(100)
  query           String?  @db.VarChar(500)
  filters         Json     @default("{}")
  sortBy          String?  @map("sort_by") @db.VarChar(50)
  resultsCount    Int      @map("results_count")
  resultIds       Json     @default("[]")  @map("result_ids")  // top-20 warehouse IDs
  clickedId       Int?     @map("clicked_id")                   // which warehouse user clicked
  clickPosition   Int?     @map("click_position")               // position in results (1-based)
  bookedAfter     Boolean  @default(false) @map("booked_after") // did user book?
  responseTimeMs  Int      @map("response_time_ms")
  userAgent       String?  @map("user_agent") @db.VarChar(500)
  ipHash          String?  @map("ip_hash") @db.VarChar(64)      // hashed IP, not raw
  createdAt       DateTime @default(now()) @map("created_at")
  
  user            User?    @relation(fields: [userId], references: [id])

  @@map("search_logs")
  @@index([userId])
  @@index([sessionId])
  @@index([createdAt])
  @@index([clickedId])
}
```

### 3.3. Activity Logging Service

```typescript
// src/common/services/activity-log.service.ts
@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    eventType: string;
    userId?: number;
    entityType?: string;   // 'booking', 'warehouse', 'box', 'review'
    entityId?: number;
    metadata?: Record<string, any>;
    ipAddress?: string;
  }) {
    await this.prisma.eventsLog.create({
      data: {
        eventType: data.eventType,
        userId: data.userId,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata || {},
        ipAddress: data.ipAddress,
      },
    });
  }
}
```

### 3.4. Event Types to Log

| Event Type | Trigger | Key Metadata |
|-----------|---------|-------------|
| `user.registered` | Registration | role, source |
| `user.login` | Login | device, ip_hash |
| `user.profile_updated` | Profile change | changed_fields |
| `warehouse.searched` | Search request | query, filters, results_count |
| `warehouse.viewed` | Detail page opened | warehouseId, source, duration_ms |
| `warehouse.favorited` | Added to favorites | warehouseId |
| `warehouse.unfavorited` | Removed from favorites | warehouseId |
| `warehouse.created` | Operator creates warehouse | warehouseId |
| `warehouse.updated` | Operator updates warehouse | warehouseId, changed_fields |
| `box.created` | Operator adds box | boxId, warehouseId |
| `box.price_changed` | Price update | boxId, old_price, new_price |
| `booking.created` | New booking | bookingId, warehouseId, price |
| `booking.confirmed` | Operator confirms | bookingId |
| `booking.cancelled` | Cancellation | bookingId, cancelled_by, reason |
| `booking.completed` | Booking ends | bookingId |
| `booking.expired` | Auto-expired | bookingId |
| `review.created` | New review | reviewId, warehouseId, rating |
| `ai.box_recommendation` | AI box finder used | input_text, recommended_size |

### 3.5. Activity Log Listener (connects Event Bus → DB)

```typescript
// src/common/listeners/activity-log.listener.ts
@Injectable()
export class ActivityLogListener {
  constructor(private activityLog: ActivityLogService) {}

  @OnEvent('booking.created')
  async onBookingCreated(event: BookingCreatedEvent) {
    await this.activityLog.log({
      eventType: 'booking.created',
      userId: event.userId,
      entityType: 'booking',
      entityId: event.bookingId,
      metadata: {
        warehouseId: event.warehouseId,
        boxId: event.boxId,
        priceTotal: event.priceTotal,
        durationMonths: event.durationMonths,
      },
    });
  }

  @OnEvent('booking.cancelled')
  async onBookingCancelled(event: BookingCancelledEvent) {
    await this.activityLog.log({
      eventType: 'booking.cancelled',
      entityType: 'booking',
      entityId: event.bookingId,
      metadata: {
        cancelledBy: event.cancelledBy,
        cancelReason: event.cancelReason,
      },
    });
  }

  // ... one handler per event type
}
```

---

## 4. Component 3: Search Query Logging

### 4.1. Purpose

Search logs are the MOST valuable data for future AI Search Ranking.
They answer: "What did users search for? What did they click? Did they book?"

### 4.2. How it works

```
User searches "small box al quoz" with filters {maxPrice: 300}
    ↓
1. WarehousesService executes search, measures responseTimeMs
2. Returns results to user
3. Emits UserSearchedEvent with query + filters + resultIds + timing
4. SearchLogListener writes to search_logs table
    ↓
Later: user clicks warehouse #42 from results
    ↓
5. Frontend calls: POST /search-log/:searchLogId/click { warehouseId: 42 }
6. Updates search_logs.clicked_id = 42, click_position = 3
    ↓
Even later: user books warehouse #42
    ↓
7. BookingsService, after booking created, checks if recent search log exists
8. Updates search_logs.booked_after = true
```

### 4.3. Search Log Service

```typescript
// src/common/services/search-log.service.ts
@Injectable()
export class SearchLogService {
  constructor(private prisma: PrismaService) {}

  async logSearch(data: {
    userId?: number;
    sessionId: string;
    query?: string;
    filters: Record<string, any>;
    sortBy?: string;
    resultsCount: number;
    resultIds: number[];
    responseTimeMs: number;
    userAgent?: string;
    ipHash?: string;
  }): Promise<number> {
    const log = await this.prisma.searchLog.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId,
        query: data.query,
        filters: data.filters,
        sortBy: data.sortBy,
        resultsCount: data.resultsCount,
        resultIds: data.resultIds.slice(0, 20), // top 20 only
        responseTimeMs: data.responseTimeMs,
        userAgent: data.userAgent,
        ipHash: data.ipHash,
      },
    });
    return log.id;
  }

  async logClick(searchLogId: number, warehouseId: number) {
    const log = await this.prisma.searchLog.findUnique({
      where: { id: searchLogId },
    });
    if (!log) return;

    const resultIds = log.resultIds as number[];
    const position = resultIds.indexOf(warehouseId) + 1;

    await this.prisma.searchLog.update({
      where: { id: searchLogId },
      data: {
        clickedId: warehouseId,
        clickPosition: position > 0 ? position : null,
      },
    });
  }

  async markBookedAfter(userId: number, warehouseId: number) {
    // Find most recent search by this user that included this warehouse
    const recentLog = await this.prisma.searchLog.findFirst({
      where: {
        userId,
        resultIds: { path: '$', array_contains: warehouseId },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // last 24h
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentLog) {
      await this.prisma.searchLog.update({
        where: { id: recentLog.id },
        data: { bookedAfter: true },
      });
    }
  }
}
```

### 4.4. Integration with Warehouses Module

```typescript
// In WarehousesController — after search
@Get()
async search(@Query() query: SearchWarehousesQueryDto, @Req() req) {
  const startTime = Date.now();
  const results = await this.warehousesService.search(query);
  const responseTimeMs = Date.now() - startTime;

  // Fire-and-forget search logging
  this.eventEmitter.emit('user.searched', new UserSearchedEvent(
    req.user?.id || null,
    req.cookies?.session_id || req.headers['x-session-id'] || 'anonymous',
    query.query,
    query,  // full filters
    results.meta.total,
    responseTimeMs,
  ));

  return results;
}
```

### 4.5. Click Tracking Endpoint (lightweight)

```typescript
// In WarehousesController — click tracking
@Post('search-log/:logId/click')
@HttpCode(204)
async logSearchClick(
  @Param('logId', ParseIntPipe) logId: number,
  @Body('warehouseId', ParseIntPipe) warehouseId: number,
) {
  await this.searchLogService.logClick(logId, warehouseId);
}
```

### 4.6. Future Value

After 1000+ searches with clicks:
- Train search ranking model (DOC-075)
- "Users who searched X often booked Y" → recommendations
- Identify unserved demand ("100 searches for Sharjah, 0 results" → recruit operators)
- A/B test ranking algorithms

---

## 5. Component 4: RAG Auto-Indexing

### 5.1. Purpose

Keep the vector knowledge base (`knowledge_chunks`) synchronized with
warehouse data. When operator updates warehouse → embeddings update automatically.

### 5.2. Trigger: Event Bus Listener

```typescript
// src/modules/ai/listeners/rag-index.listener.ts
@Injectable()
export class RagIndexListener {
  private readonly logger = new Logger(RagIndexListener.name);

  constructor(private embeddingService: EmbeddingService) {}

  @OnEvent('warehouse.created')
  async onWarehouseCreated(event: WarehouseCreatedEvent) {
    try {
      await this.embeddingService.indexWarehouse(event.warehouseId);
      this.logger.log(`Indexed warehouse ${event.warehouseId}`);
    } catch (error) {
      this.logger.error(`Failed to index warehouse ${event.warehouseId}`, error);
      // Don't throw — indexing failure must not break main flow
    }
  }

  @OnEvent('warehouse.updated')
  async onWarehouseUpdated(event: WarehouseUpdatedEvent) {
    try {
      // Delete old chunks and re-index
      await this.embeddingService.reindexWarehouse(event.warehouseId);
      this.logger.log(`Re-indexed warehouse ${event.warehouseId}`);
    } catch (error) {
      this.logger.error(`Failed to re-index warehouse ${event.warehouseId}`, error);
    }
  }

  @OnEvent('review.created')
  async onReviewCreated(event: ReviewCreatedEvent) {
    try {
      // Re-index warehouse to include new review in knowledge base
      await this.embeddingService.reindexWarehouse(event.warehouseId);
    } catch (error) {
      this.logger.error(`Failed to re-index after review for warehouse ${event.warehouseId}`, error);
    }
  }

  @OnEvent('box.price_changed')
  async onBoxPriceChanged(event: BoxPriceChangedEvent) {
    try {
      await this.embeddingService.reindexWarehouse(event.warehouseId);
    } catch (error) {
      this.logger.error(`Failed to re-index after price change for warehouse ${event.warehouseId}`, error);
    }
  }
}
```

### 5.3. What Gets Chunked

```typescript
// src/modules/ai/embedding.service.ts
private chunkWarehouseData(warehouse: WarehouseWithRelations): TextChunk[] {
  const chunks: TextChunk[] = [];

  // Chunk 1: Overview
  chunks.push({
    content: `${warehouse.name} is a storage facility in ${warehouse.district}, ${warehouse.emirate}. ` +
             `${warehouse.description || ''} ` +
             `Address: ${warehouse.address}. ` +
             `Operating hours: ${warehouse.workingHours || 'Contact for details'}.`,
    metadata: { type: 'overview', warehouseId: warehouse.id },
  });

  // Chunk 2: Box inventory and pricing
  const boxSummary = warehouse.boxes.map(box =>
    `${box.size} box (${box.areaSquareMeters}m²): ${box.priceMonthly} AED/month, ` +
    `${box.availableQuantity} available` +
    `${box.hasClimateControl ? ', climate controlled' : ''}`
  ).join('. ');
  
  chunks.push({
    content: `Storage options at ${warehouse.name}: ${boxSummary}`,
    metadata: { type: 'inventory', warehouseId: warehouse.id },
  });

  // Chunk 3: Features and amenities
  const features = [];
  if (warehouse.has24HourAccess) features.push('24-hour access');
  if (warehouse.hasCCTV) features.push('CCTV surveillance');
  if (warehouse.hasLoadingDock) features.push('loading dock');
  if (warehouse.hasParking) features.push('parking');
  // ... more features from metadata JSONB
  
  if (features.length > 0) {
    chunks.push({
      content: `${warehouse.name} features: ${features.join(', ')}.`,
      metadata: { type: 'features', warehouseId: warehouse.id },
    });
  }

  // Chunk 4: Reviews summary (if any)
  if (warehouse.reviewCount > 0) {
    chunks.push({
      content: `${warehouse.name} has ${warehouse.reviewCount} reviews with an average rating of ` +
               `${warehouse.averageRating}/5.`,
      metadata: { type: 'reviews', warehouseId: warehouse.id },
    });
  }

  return chunks;
}
```

### 5.4. Reindex Method

```typescript
async reindexWarehouse(warehouseId: number): Promise<void> {
  // Delete existing chunks for this warehouse
  await this.prisma.knowledgeChunk.deleteMany({
    where: { sourceType: 'warehouse', sourceId: warehouseId.toString() },
  });

  // Fetch fresh data and re-index
  await this.indexWarehouse(warehouseId);
}
```

### 5.5. Batch Reindex (manual, for admin)

```typescript
// For initial population or full rebuild
async reindexAll(): Promise<{ indexed: number; failed: number }> {
  const warehouses = await this.prisma.warehouse.findMany({
    where: { status: 'active', deletedAt: null },
  });

  let indexed = 0, failed = 0;
  for (const wh of warehouses) {
    try {
      await this.reindexWarehouse(wh.id);
      indexed++;
    } catch {
      failed++;
    }
  }
  return { indexed, failed };
}
```

---

## 6. File Structure Additions

```
src/
├── common/
│   ├── events/                          # NEW: Event definitions
│   │   ├── booking.events.ts
│   │   ├── warehouse.events.ts
│   │   ├── box.events.ts
│   │   ├── user.events.ts
│   │   ├── review.events.ts
│   │   └── crm.events.ts
│   ├── listeners/                       # NEW: Cross-cutting listeners
│   │   └── activity-log.listener.ts
│   └── services/                        # NEW: Shared services
│       ├── activity-log.service.ts
│       └── search-log.service.ts
├── modules/
│   ├── ai/
│   │   ├── listeners/                   # NEW: RAG event listeners
│   │   │   └── rag-index.listener.ts
│   │   ├── embedding.service.ts         # (already planned)
│   │   └── knowledge.service.ts         # (already planned)
```

---

## 7. Implementation Order

| Step | Component | Depends On | Est. Time |
|------|-----------|-----------|-----------|
| 1 | Install @nestjs/event-emitter, create event classes | Nothing | 30 min |
| 2 | Add SearchLog model to Prisma, run migration | Step 1 | 15 min |
| 3 | Create ActivityLogService + SearchLogService | Step 2 | 30 min |
| 4 | Add event emits to existing services (bookings, warehouses, boxes, reviews) | Step 1 | 45 min |
| 5 | Create ActivityLogListener (events → events_log) | Steps 3-4 | 30 min |
| 6 | Add search logging to WarehousesController | Steps 3-4 | 20 min |
| 7 | Create RagIndexListener (events → knowledge_chunks) | Step 4 | 20 min |
| 8 | Verify: create warehouse → check events_log + knowledge_chunks | All | 15 min |

**Total: ~3 hours**

---

## 8. Data Retention

| Table | Retention | Rationale |
|-------|-----------|-----------|
| `events_log` | 12 months | AI training needs 6-12 months of data |
| `search_logs` | 6 months | Search ranking needs recent behavior |
| `knowledge_chunks` | Permanent (updated) | Always reflects current data |
| `ai_conversations` | 6 months | Chat history for context |

Implement cleanup cron job (monthly):
```sql
DELETE FROM events_log WHERE created_at < NOW() - INTERVAL '12 months';
DELETE FROM search_logs WHERE created_at < NOW() - INTERVAL '6 months';
DELETE FROM ai_conversations WHERE created_at < NOW() - INTERVAL '6 months';
```

---

## 9. Privacy & Compliance

- **IP addresses:** Store hashed (SHA-256), never raw. Compliant with UAE PDPL.
- **User IDs in search_logs:** Nullable. Anonymous searches logged without user_id.
- **No PII in events_log metadata:** Only IDs and technical data, never names/emails.
- **Data export:** events_log and search_logs included in user data export (PDPL right).
- **Data deletion:** When user deletes account, anonymize userId in logs (set to null).

---

## 10. Monitoring

Add Prometheus metrics (via existing monitoring setup):

```
app_events_emitted_total{event_type="booking.created"}     — counter
app_events_processing_errors_total{listener="rag_index"}   — counter
app_search_logs_total                                       — counter
app_rag_index_duration_seconds{operation="index"}           — histogram
```

Alert if:
- `app_events_processing_errors_total` > 10 in 5 minutes
- `app_rag_index_duration_seconds` p95 > 30 seconds
