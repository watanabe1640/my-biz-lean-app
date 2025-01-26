-- src/lib/db/migrations/002_sample_data.sql
INSERT INTO books (title, author) VALUES 
('7つの習慣', 'スティーブン・R・コヴィー');

INSERT INTO quizzes (book_id, question, options, correct_answer, explanation) VALUES 
(1, '7つの習慣の第1の習慣は？', 
  ARRAY['主体的である', '目的を持って始める', '最優先事項を優先する', '相乗効果を創り出す'],
  0,
  '第1の習慣は「主体的である」です。');