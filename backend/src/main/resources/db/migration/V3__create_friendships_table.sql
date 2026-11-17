
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_friendship_sender
        FOREIGN KEY (sender_id) REFERENCES users(id),

    CONSTRAINT fk_friendship_receiver
        FOREIGN KEY (receiver_id) REFERENCES users(id),

    CONSTRAINT chk_friendship_different_users
        CHECK (sender_id <> receiver_id),

    CONSTRAINT chk_friendship_status
        CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED'))
);

CREATE INDEX idx_friendships_sender
    ON friendships(sender_id);

CREATE INDEX idx_friendships_receiver
    ON friendships(receiver_id);

CREATE INDEX idx_friendships_status
    ON friendships(status);
