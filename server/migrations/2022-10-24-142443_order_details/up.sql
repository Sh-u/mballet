-- Your SQL goes here


CREATE TABLE order_lines {
  id UUID NOT NULL PRIMARY KEY,
  order_id references orders(id),
  product_id references ballet_classes(id)
  created_at TIMESTAMP NOT NULL
}