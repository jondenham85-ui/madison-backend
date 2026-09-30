-- MADISON VOICE LOGS TABLE
CREATE TABLE IF NOT EXISTS voice_logs (
    id SERIAL PRIMARY KEY,

    -- Who spoke (owner, partner, system)
    speaker VARCHAR(20) NOT NULL,

    -- What the user said (after Whisper transcription)
    user_text TEXT NOT NULL,

    -- Madison's response text
    madison_text TEXT NOT NULL,

    -- Detected emotion (calm, excited, urgent, sad, neutral)
    emotion VARCHAR(20) NOT NULL,

    -- Full conversation snapshot (JSON)
    history JSONB NOT NULL,

    -- Timestamp of the event
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast querying by speaker
CREATE INDEX IF NOT EXISTS idx_voice_logs_speaker
ON voice_logs (speaker);

-- Index for fast querying by emotion
CREATE INDEX IF NOT EXISTS idx_voice_logs_emotion
ON voice_logs (emotion);

-- Index for fast chronological queries
CREATE INDEX IF NOT EXISTS idx_voice_logs_created_at
ON voice_logs (created_at);
