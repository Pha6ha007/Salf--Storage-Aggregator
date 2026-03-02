-- Migration: Add Chat Sessions and Extend AI Conversations
-- Step 22: WhatsApp AI Bot & Web Chat Infrastructure
-- Date: 2026-03-02

-- Create ChatChannel enum
CREATE TYPE "ChatChannel" AS ENUM ('whatsapp', 'web');

-- Create chat_sessions table
CREATE TABLE "chat_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- Add indexes to chat_sessions
CREATE INDEX "chat_sessions_phone_number_idx" ON "chat_sessions"("phone_number");
CREATE INDEX "chat_sessions_user_id_idx" ON "chat_sessions"("user_id");
CREATE INDEX "chat_sessions_session_token_idx" ON "chat_sessions"("session_token");
CREATE INDEX "chat_sessions_expires_at_idx" ON "chat_sessions"("expires_at");

-- Add foreign keys to chat_sessions
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_lead_id_fkey"
    FOREIGN KEY ("lead_id") REFERENCES "crm_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Extend ai_conversations table
ALTER TABLE "ai_conversations" ADD COLUMN "channel" VARCHAR(20);
ALTER TABLE "ai_conversations" ADD COLUMN "chat_session_id" UUID;
ALTER TABLE "ai_conversations" ADD COLUMN "intent" VARCHAR(50);
ALTER TABLE "ai_conversations" ADD COLUMN "confidence" REAL;
ALTER TABLE "ai_conversations" ADD COLUMN "metadata" JSONB NOT NULL DEFAULT '{}';

-- Add indexes to ai_conversations for new columns
CREATE INDEX "ai_conversations_chat_session_id_idx" ON "ai_conversations"("chat_session_id");
CREATE INDEX "ai_conversations_channel_idx" ON "ai_conversations"("channel");

-- Add foreign key for chat_session_id
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_chat_session_id_fkey"
    FOREIGN KEY ("chat_session_id") REFERENCES "chat_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for chat_sessions
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON "chat_sessions"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comment
COMMENT ON TABLE "chat_sessions" IS 'Chat sessions for WhatsApp and Web Chat channels';
COMMENT ON COLUMN "chat_sessions"."channel" IS 'Communication channel: whatsapp or web';
COMMENT ON COLUMN "chat_sessions"."lead_captured" IS 'Whether a CRM lead was auto-created from this chat';
COMMENT ON COLUMN "ai_conversations"."intent" IS 'Classified intent of the message';
COMMENT ON COLUMN "ai_conversations"."confidence" IS 'Confidence score of intent classification (0.0-1.0)';
