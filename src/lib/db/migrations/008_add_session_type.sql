-- src/lib/db/migrations/008_add_session_type.sql
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS session_type session_type;
