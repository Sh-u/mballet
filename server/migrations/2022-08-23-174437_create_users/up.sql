-- Your SQL goes here

CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  img VARCHAR,
  is_admin BOOLEAN NOT NULL default 't',
  is_confirmed BOOLEAN NOT NULL default 'f',
  auth_type TEXT NOT NULL DEFAULT 'classic',
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  UNIQUE (username)
);