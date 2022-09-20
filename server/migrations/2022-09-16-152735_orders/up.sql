-- Your SQL goes here

CREATE TABLE orders (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  booking_id UUID references bookings(id),
  created_at TIMESTAMP NOT NULL
);