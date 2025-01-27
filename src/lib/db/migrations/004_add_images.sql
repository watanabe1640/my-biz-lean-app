-- src/lib/db/migrations/004_add_images.sql
ALTER TABLE users ADD COLUMN 
  avatar_type INTEGER DEFAULT 1;

ALTER TABLE books ADD COLUMN 
  cover_image_url TEXT DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaJbyQXIEJicE1vtBIDbojEe-XLjBw735wnKiRlmnkXGLIxkzN'; -- 7つの習慣のカバー画像