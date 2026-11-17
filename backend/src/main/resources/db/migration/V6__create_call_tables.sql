
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caller_id UUID NOT NULL REFERENCES users(id),
    room_name VARCHAR(150) NOT NULL UNIQUE,
    call_type VARCHAR(20) NOT NULL
        CHECK (call_type IN (
            'VOICE',
            'VIDEO',
            'GROUP_VOICE',
            'GROUP_VIDEO'
        )),
    status VARCHAR(20) NOT NULL DEFAULT 'RINGING'
        CHECK (status IN (
            'RINGING',
            'ACCEPTED',
            'REJECTED',
            'MISSED',
            'ENDED',
            'CANCELLED'
        )),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE call_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL
        REFERENCES calls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,

    CONSTRAINT uk_call_participant
        UNIQUE (call_id, user_id)
);

CREATE TABLE call_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL
        REFERENCES calls(id) ON DELETE CASCADE,
    event_type VARCHAR(40) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_call_participants_user
    ON call_participants(user_id);
