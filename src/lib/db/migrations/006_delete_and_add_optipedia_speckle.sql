-- src/lib/db/migrations/006_delete_and_add_optipedia_speckle.sql
-- 既存データの削除
DELETE FROM user_progress WHERE quiz_id IN (
  SELECT q.id FROM quizzes q
  JOIN chapters c ON c.id = q.chapter_id
  JOIN books b ON b.id = c.book_id
  WHERE b.title = 'Optipediaスペックル'
);

DELETE FROM quizzes WHERE chapter_id IN (
  SELECT c.id FROM chapters c
  JOIN books b ON b.id = c.book_id
  WHERE b.title = 'Optipediaスペックル'
);

DELETE FROM chapters WHERE book_id IN (
  SELECT id FROM books WHERE title = 'Optipediaスペックル'
);

DELETE FROM books WHERE title = 'Optipediaスペックル';

-- 新しいデータの挿入
WITH new_book AS (
  INSERT INTO books (title, author, cover_image_url) VALUES 
  ('Optipediaスペックル', 'Optipedia', 'https://placehold.co/400x600?text=Optipedia+Speckle') 
  RETURNING id
), 
new_chapter AS (
  INSERT INTO chapters (book_id, chapter_number, title) VALUES 
  ((SELECT id FROM new_book), 1, '1原理')
  RETURNING id
)
INSERT INTO quizzes (chapter_id, question, options, correct_answer, explanation) VALUES
((SELECT id FROM new_chapter), 'レーザースペックルとは何か、最も適切な説明を選んでください。', 
  ARRAY['粗い表面にレーザー光を当てたときに生じる、規則的な縞模様',
        '粗い表面にレーザー光を当てたときに生じる、粒状の干渉模様',
        '滑らかな表面にレーザー光を当てたときに生じる、光の回折現象',
        'レーザー光が空気中で散乱して生じる、光の拡散現象'],
  1,
  'レーザースペックルは、粗い表面の凹凸によって散乱されたレーザー光が干渉することで生じる、不規則な粒状の模様です。規則的な縞模様ではありません。'),

((SELECT id FROM new_chapter), 'レーザースペックルが発生する主な原因はどれですか？',
  ARRAY['レーザー光の波長が短いこと',
        '表面の粗さによる光の散乱と干渉',
        'レーザー光の強度が強いこと',
        '空気中の塵による光の散乱'],
  1,
  'レーザースペックルは、表面の微細な凹凸によって散乱されたレーザー光が、互いに干渉することで発生します。波長が短いことや強度が強いことは、スペックルの見え方に影響しますが、発生の直接的な原因ではありません。空気中の塵は、別の種類の散乱を引き起こします。'),

((SELECT id FROM new_chapter), 'レーザースペックルが当初認識されていた役割は？',
  ARRAY['精密計測技術',
        'ホログラフィーのノイズ',
        '光通信技術',
        '画像処理技術'],
  1,
  'レーザースペックルは、当初はホログラフィーにおけるノイズとして認識されていました。その後、その特性が利用できることが発見され、精密計測技術に応用されるようになりました。'),

((SELECT id FROM new_chapter), 'レーザースペックルを利用した計測技術の例として、最も適切なものはどれですか？',
  ARRAY['音声認識',
        '表面変形の非接触測定',
        '血液検査',
        '天気予報'],
  1,
  'レーザースペックルは、表面の変形や動きを非接触で測定する技術に用いられます。'),

((SELECT id FROM new_chapter), 'デジタル技術の進歩がレーザースペックル計測に与えた最も大きな影響は？',
  ARRAY['レーザー光の出力向上',
        '計測精度の低下',
        'リアルタイム計測とデータ処理の容易化',
        '計測コストの増加'],
  2,
  'デジタル技術の進歩により、リアルタイムでの計測とデータ処理が可能になりました。');