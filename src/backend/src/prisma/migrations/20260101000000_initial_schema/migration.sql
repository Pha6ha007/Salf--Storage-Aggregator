-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
    CREATE TYPE "UserRole" AS ENUM ('user', 'operator', 'admin');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BookingStatus') THEN
    CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'expired');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BookingPaymentStatus') THEN
    CREATE TYPE "BookingPaymentStatus" AS ENUM ('pending', 'partial', 'paid', 'overdue', 'refunded');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BookingCancelledBy') THEN
    CREATE TYPE "BookingCancelledBy" AS ENUM ('user', 'operator', 'system');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BoxSize') THEN
    CREATE TYPE "BoxSize" AS ENUM ('S', 'M', 'L', 'XL');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BoxStatus') THEN
    CREATE TYPE "BoxStatus" AS ENUM ('available', 'reserved', 'occupied', 'maintenance');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WarehouseStatus') THEN
    CREATE TYPE "WarehouseStatus" AS ENUM ('draft', 'pending_moderation', 'active', 'inactive', 'blocked');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CrmLeadStatus') THEN
    CREATE TYPE "CrmLeadStatus" AS ENUM ('new', 'contacted', 'in_progress', 'closed');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MediaFileType') THEN
    CREATE TYPE "MediaFileType" AS ENUM ('image', 'video');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CrmContactType') THEN
    CREATE TYPE "CrmContactType" AS ENUM ('call', 'email', 'sms', 'chat', 'form_submission');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CrmInitiatedBy') THEN
    CREATE TYPE "CrmInitiatedBy" AS ENUM ('user', 'operator');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AiRequestStatus') THEN
    CREATE TYPE "AiRequestStatus" AS ENUM ('success', 'error', 'timeout');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ChatChannel') THEN
    CREATE TYPE "ChatChannel" AS ENUM ('whatsapp', 'web');
  END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone" VARCHAR(20),
    "avatar_url" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMPTZ(6),
    "password_reset_token" VARCHAR(255),
    "password_reset_expires" TIMESTAMPTZ(6),
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "operators" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "trade_license_number" VARCHAR(100),
    "tax_registration_number" VARCHAR(100),
    "legal_address" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMPTZ(6),
    "verification_documents" JSONB,
    "business_phone" VARCHAR(20),
    "business_email" VARCHAR(255),
    "website" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "operators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "operator_settings" (
    "id" SERIAL NOT NULL,
    "operator_id" INTEGER NOT NULL,
    "auto_confirm_bookings" BOOLEAN NOT NULL DEFAULT false,
    "deposit_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "cancellation_policy_days" INTEGER,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "sms_notifications" BOOLEAN NOT NULL DEFAULT false,
    "whatsapp_notifications" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "operator_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "user_agent" VARCHAR(500),
    "ip_address" VARCHAR(45),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "warehouses" (
    "id" SERIAL NOT NULL,
    "operator_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "WarehouseStatus" NOT NULL DEFAULT 'draft',
    "address" TEXT NOT NULL,
    "emirate" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100),
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "has_climate_control" BOOLEAN NOT NULL DEFAULT false,
    "has_24x7_access" BOOLEAN NOT NULL DEFAULT false,
    "has_security_cameras" BOOLEAN NOT NULL DEFAULT false,
    "has_insurance" BOOLEAN NOT NULL DEFAULT false,
    "has_parking_space" BOOLEAN NOT NULL DEFAULT false,
    "working_hours" JSONB,
    "contact_phone" VARCHAR(20),
    "contact_email" VARCHAR(255),
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "boxes" (
    "id" SERIAL NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "box_number" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255),
    "description" TEXT,
    "size" "BoxSize" NOT NULL,
    "length_meters" DECIMAL(5,2),
    "width_meters" DECIMAL(5,2),
    "height_meters" DECIMAL(5,2),
    "area_square_meters" DECIMAL(6,2),
    "price_monthly" DECIMAL(10,2) NOT NULL,
    "total_quantity" INTEGER NOT NULL DEFAULT 1,
    "available_quantity" INTEGER NOT NULL DEFAULT 1,
    "reserved_quantity" INTEGER NOT NULL DEFAULT 0,
    "occupied_quantity" INTEGER NOT NULL DEFAULT 0,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "has_climate_control" BOOLEAN NOT NULL DEFAULT false,
    "has_electricity" BOOLEAN NOT NULL DEFAULT false,
    "has_shelf" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "boxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "media" (
    "id" SERIAL NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "file_type" "MediaFileType" NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_size_bytes" INTEGER,
    "mime_type" VARCHAR(100),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "caption" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "bookings" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "box_id" INTEGER NOT NULL,
    "booking_number" VARCHAR(50) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "confirmed_at" TIMESTAMPTZ(6),
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "cancelled_at" TIMESTAMPTZ(6),
    "cancelled_by" "BookingCancelledBy",
    "cancel_reason" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "duration_months" INTEGER NOT NULL,
    "base_price_per_month" DECIMAL(10,2) NOT NULL,
    "discount_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "monthly_price" DECIMAL(10,2) NOT NULL,
    "price_total" DECIMAL(10,2) NOT NULL,
    "payment_status" "BookingPaymentStatus" NOT NULL DEFAULT 'pending',
    "payment_received_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "reviews" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "booking_id" INTEGER,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT,
    "operator_response" TEXT,
    "responded_at" TIMESTAMPTZ(6),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "favorites" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "crm_leads" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "status" "CrmLeadStatus" NOT NULL DEFAULT 'new',
    "is_spam" BOOLEAN NOT NULL DEFAULT false,
    "warehouse_id" INTEGER,
    "user_id" UUID,
    "source" VARCHAR(100),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "crm_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "crm_contacts" (
    "id" SERIAL NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "contact_type" "CrmContactType" NOT NULL,
    "initiated_by" "CrmInitiatedBy" NOT NULL,
    "subject" VARCHAR(255),
    "message" TEXT,
    "duration_seconds" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "crm_activities" (
    "id" SERIAL NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "activity_type_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMPTZ(6),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "crm_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "crm_activity_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "icon" VARCHAR(50),
    "color" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_activity_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "crm_status_history" (
    "id" SERIAL NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "from_status" "CrmLeadStatus",
    "to_status" "CrmLeadStatus" NOT NULL,
    "changed_by_user_id" UUID,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ai_requests_log" (
    "id" SERIAL NOT NULL,
    "user_id" UUID,
    "request_type" VARCHAR(100) NOT NULL,
    "input_text" TEXT,
    "output_text" TEXT,
    "model" VARCHAR(100),
    "tokens_used" INTEGER,
    "status" "AiRequestStatus" NOT NULL,
    "error_message" TEXT,
    "processing_time_ms" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_requests_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "events_log" (
    "id" SERIAL NOT NULL,
    "event_name" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100),
    "entity_id" VARCHAR(100),
    "actor_id" UUID,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "request_id" VARCHAR(100),
    "payload" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "search_logs" (
    "id" SERIAL NOT NULL,
    "user_id" UUID,
    "query_text" VARCHAR(500),
    "filters" JSONB,
    "emirate" VARCHAR(100),
    "box_size" VARCHAR(10),
    "max_price" INTEGER,
    "results_count" INTEGER NOT NULL,
    "result_ids" JSONB,
    "clicked_warehouse_id" INTEGER,
    "clicked_at" TIMESTAMPTZ(6),
    "conversion_booking_id" INTEGER,
    "session_id" VARCHAR(100),
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "geo_cache" (
    "id" SERIAL NOT NULL,
    "address_query" VARCHAR(500) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "formatted_address" TEXT,
    "provider" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),

    CONSTRAINT "geo_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "chat_sessions" (
    "id" UUID NOT NULL,
    "channel" "ChatChannel" NOT NULL,
    "user_id" UUID,
    "phone_number" VARCHAR(20),
    "session_token" VARCHAR(100),
    "language" VARCHAR(5) NOT NULL DEFAULT 'en',
    "page_context" JSONB NOT NULL DEFAULT '{}',
    "lead_captured" BOOLEAN NOT NULL DEFAULT false,
    "lead_id" INTEGER,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "last_message_at" TIMESTAMPTZ(6),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "knowledge_chunks" (
    "id" UUID NOT NULL,
    "source_type" VARCHAR(50) NOT NULL,
    "source_id" UUID,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ai_conversations" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "session_id" VARCHAR(100) NOT NULL,
    "channel" VARCHAR(20),
    "chat_session_id" UUID,
    "intent" VARCHAR(50),
    "confidence" REAL,
    "role" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "tokens_used" INTEGER,
    "model" VARCHAR(50),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "operators_user_id_key" ON "operators"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "operators_user_id_idx" ON "operators"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "operators_is_verified_idx" ON "operators"("is_verified");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "operators_deleted_at_idx" ON "operators"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "operator_settings_operator_id_key" ON "operator_settings"("operator_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "operator_settings_operator_id_idx" ON "operator_settings"("operator_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "warehouses_operator_id_idx" ON "warehouses"("operator_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "warehouses_status_idx" ON "warehouses"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "warehouses_is_active_idx" ON "warehouses"("is_active");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "warehouses_emirate_idx" ON "warehouses"("emirate");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "warehouses_rating_idx" ON "warehouses"("rating");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "warehouses_deleted_at_idx" ON "warehouses"("deleted_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "boxes_warehouse_id_idx" ON "boxes"("warehouse_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "boxes_size_idx" ON "boxes"("size");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "boxes_is_available_idx" ON "boxes"("is_available");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "boxes_deleted_at_idx" ON "boxes"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "boxes_warehouse_id_box_number_key" ON "boxes"("warehouse_id", "box_number");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "media_warehouse_id_idx" ON "media"("warehouse_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "media_is_primary_idx" ON "media"("is_primary");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "media_display_order_idx" ON "media"("display_order");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "bookings_booking_number_key" ON "bookings"("booking_number");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bookings_warehouse_id_idx" ON "bookings"("warehouse_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bookings_box_id_idx" ON "bookings"("box_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bookings_booking_number_idx" ON "bookings"("booking_number");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bookings_start_date_idx" ON "bookings"("start_date");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bookings_deleted_at_idx" ON "bookings"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "reviews_booking_id_key" ON "reviews"("booking_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "reviews_warehouse_id_idx" ON "reviews"("warehouse_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "reviews_user_id_idx" ON "reviews"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "reviews_verified_idx" ON "reviews"("verified");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "reviews_is_visible_idx" ON "reviews"("is_visible");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "reviews_user_id_warehouse_id_key" ON "reviews"("user_id", "warehouse_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "favorites_user_id_idx" ON "favorites"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "favorites_warehouse_id_idx" ON "favorites"("warehouse_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_user_id_warehouse_id_key" ON "favorites"("user_id", "warehouse_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_leads_status_idx" ON "crm_leads"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_leads_warehouse_id_idx" ON "crm_leads"("warehouse_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_leads_user_id_idx" ON "crm_leads"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_leads_is_spam_idx" ON "crm_leads"("is_spam");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_contacts_lead_id_idx" ON "crm_contacts"("lead_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_contacts_contact_type_idx" ON "crm_contacts"("contact_type");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_activities_lead_id_idx" ON "crm_activities"("lead_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_activities_activity_type_id_idx" ON "crm_activities"("activity_type_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_activities_due_date_idx" ON "crm_activities"("due_date");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_activities_completed_idx" ON "crm_activities"("completed");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "crm_activity_types_name_key" ON "crm_activity_types"("name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_status_history_lead_id_idx" ON "crm_status_history"("lead_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crm_status_history_to_status_idx" ON "crm_status_history"("to_status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ai_requests_log_user_id_idx" ON "ai_requests_log"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ai_requests_log_request_type_idx" ON "ai_requests_log"("request_type");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ai_requests_log_status_idx" ON "ai_requests_log"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "events_log_event_name_idx" ON "events_log"("event_name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "events_log_actor_id_idx" ON "events_log"("actor_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "events_log_entity_type_entity_id_idx" ON "events_log"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "events_log_request_id_idx" ON "events_log"("request_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "search_logs_user_id_idx" ON "search_logs"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "search_logs_session_id_idx" ON "search_logs"("session_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "search_logs_created_at_idx" ON "search_logs"("created_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "search_logs_clicked_warehouse_id_idx" ON "search_logs"("clicked_warehouse_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "geo_cache_address_query_key" ON "geo_cache"("address_query");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "geo_cache_address_query_idx" ON "geo_cache"("address_query");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "chat_sessions_phone_number_idx" ON "chat_sessions"("phone_number");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "chat_sessions_user_id_idx" ON "chat_sessions"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "chat_sessions_session_token_idx" ON "chat_sessions"("session_token");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "chat_sessions_expires_at_idx" ON "chat_sessions"("expires_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "knowledge_chunks_source_type_idx" ON "knowledge_chunks"("source_type");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "knowledge_chunks_source_id_idx" ON "knowledge_chunks"("source_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ai_conversations_session_id_idx" ON "ai_conversations"("session_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ai_conversations_user_id_idx" ON "ai_conversations"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ai_conversations_chat_session_id_idx" ON "ai_conversations"("chat_session_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ai_conversations_channel_idx" ON "ai_conversations"("channel");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "operators" ADD CONSTRAINT "operators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "operator_settings" ADD CONSTRAINT "operator_settings_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "boxes" ADD CONSTRAINT "boxes_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "media" ADD CONSTRAINT "media_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "boxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "favorites" ADD CONSTRAINT "favorites_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "crm_contacts" ADD CONSTRAINT "crm_contacts_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "crm_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "crm_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_activity_type_id_fkey" FOREIGN KEY ("activity_type_id") REFERENCES "crm_activity_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "crm_status_history" ADD CONSTRAINT "crm_status_history_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "crm_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "crm_status_history" ADD CONSTRAINT "crm_status_history_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "ai_requests_log" ADD CONSTRAINT "ai_requests_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "events_log" ADD CONSTRAINT "events_log_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_clicked_warehouse_id_fkey" FOREIGN KEY ("clicked_warehouse_id") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_conversion_booking_id_fkey" FOREIGN KEY ("conversion_booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "crm_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_chat_session_id_fkey" FOREIGN KEY ("chat_session_id") REFERENCES "chat_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

