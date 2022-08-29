-- Your SQL goes here


CREATE TABLE confirmations (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL
);