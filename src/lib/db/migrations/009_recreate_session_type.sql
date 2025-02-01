-- src/lib/db/migrations/009_recreate_session_type.sql
-- 一時的にsession_type列を削除
ALTER TABLE quiz_sessions DROP COLUMN session_type;

-- ENUMの再作成
DROP TYPE session_type;
CREATE TYPE session_type AS ENUM ('random', 'difficulty', 'chapter');

-- session_type列の再追加
ALTER TABLE quiz_sessions ADD COLUMN session_type session_type;