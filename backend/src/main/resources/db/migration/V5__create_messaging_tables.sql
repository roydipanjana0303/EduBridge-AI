
CREATE TABLE direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL
        REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    message_content TEXT NOT NULL,
    message_type VARCHAR(20) NOT NULL DEFAULT 'TEXT'
        CHECK (message_type IN ('TEXT', 'IMAGE', 'FILE', 'SYSTEM')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_messages_conversation_created
    ON direct_messages(conversation_id, created_at DESC);

CREATE TABLE message_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL
        REFERENCES direct_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,

    CONSTRAINT uk_message_receipt_user
        UNIQUE (message_id, user_id)
);
