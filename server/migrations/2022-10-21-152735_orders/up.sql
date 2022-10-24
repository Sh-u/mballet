-- Your SQL goes here

CREATE TABLE orders (
  id TEXT NOT NULL PRIMARY KEY,
  completed BOOLEAN NOT NULL DEFAULT 'f',
  transaction_id TEXT DEFAULT NULL,
  class_id UUID NOT NULL references ballet_classes(id),
  created_at TIMESTAMP NOT NULL
);


