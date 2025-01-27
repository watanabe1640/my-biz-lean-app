-- src/lib/db/migrations/002_sample_data.sql
INSERT INTO books (title, author) VALUES 
('7つの習慣', 'スティーブン・R・コヴィー');

INSERT INTO chapters (book_id, chapter_number, title) VALUES 
(1, 1, '第1の習慣：主体的である'),
(1, 2, '第2の習慣：目的を持って始める');

INSERT INTO difficulty_levels (name) VALUES 
('初級'),
('中級'),
('上級');

INSERT INTO quizzes (chapter_id, difficulty_id, question, options, correct_answer, explanation) VALUES 
(1, 1, '7つの習慣の第1の習慣は？', 
  ARRAY['主体的である', '目的を持って始める', '最優先事項を優先する', '相乗効果を創り出す'],
  0,
  '第1の習慣は「主体的である」です。'),
(1, 2, '主体的であるとは何か？',
  ARRAY['結果を待つ', '自分で決断する', '他人に従う', '運を待つ'],
  1,
  '主体的とは、自分で決断し行動することです。');