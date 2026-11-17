-- ============================================================
-- EDUBRIDGE AI - COMMUNITY CHAT / VOICE TABLES
-- References the `users` table created in V1__create_core_schema.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS chat_servers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(80)  NOT NULL,
    description VARCHAR(300),
    owner_id    UUID         NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_channels (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID         NOT NULL REFERENCES chat_servers(id) ON DELETE CASCADE,
    name      VARCHAR(80)  NOT NULL,
    type      VARCHAR(12)  NOT NULL DEFAULT 'TEXT'
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID          NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
    sender_id  UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content    VARCHAR(4000) NOT NULL,
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    edited_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_message_channel_created
    ON chat_messages(channel_id, created_at DESC);
