-- src/lib/db/migrations/005_quiz_sessions.sql
CREATE TYPE session_type AS ENUM ('chapter', 'random', 'unanswered');

CREATE TABLE quiz_sessions (
 id SERIAL PRIMARY KEY,
 user_id INTEGER REFERENCES users(id),
 session_type session_type NOT NULL,
 chapter_id INTEGER REFERENCES chapters(id),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session_quizzes (
 id SERIAL PRIMARY KEY,
 session_id INTEGER REFERENCES quiz_sessions(id),
 quiz_id INTEGER REFERENCES quizzes(id),
 order_number INTEGER NOT NULL,
 answered BOOLEAN DEFAULT false,
 is_correct BOOLEAN,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);