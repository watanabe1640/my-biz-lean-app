-- src/lib/db/migrations/007_optimize_database.sql

-- 重複テーブルの削除
DROP TABLE IF EXISTS progress;

-- 既存のクイズの難易度を更新（Optipediaスペックルの初級問題）
UPDATE quizzes q 
SET difficulty_id = 1
FROM chapters c
JOIN books b ON b.id = c.book_id
WHERE q.chapter_id = c.id 
AND b.title = 'Optipediaスペックル';

-- インデックス追加（パフォーマンス最適化）
CREATE INDEX IF NOT EXISTS idx_quizzes_chapter_difficulty 
ON quizzes(chapter_id, difficulty_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_quiz 
ON user_progress(user_id, quiz_id);

CREATE INDEX IF NOT EXISTS idx_session_quizzes_session 
ON session_quizzes(session_id);