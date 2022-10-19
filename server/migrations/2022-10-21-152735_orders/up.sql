-- Your SQL goes here

CREATE TABLE orders (
  id TEXT NOT NULL PRIMARY KEY,
  completed BOOLEAN NOT NULL DEFAULT 'f',
  transaction_id TEXT DEFAULT NULL,
  booking_id UUID references bookings(id),
  created_at TIMESTAMP NOT NULL
);