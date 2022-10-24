-- Your SQL goes here

CREATE TABLE order_details (
  id UUID NOT NULL PRIMARY KEY,
  order_id TEXT NOT NULL references orders(id),
  product_id UUID NOT NULL references ballet_classes(id),
  created_at TIMESTAMP NOT NULL
);