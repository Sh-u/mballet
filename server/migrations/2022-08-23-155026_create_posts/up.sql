-- Your SQL goes here

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    body VARCHAR NOT NULL,
    published BOOLEAN NOT NULL default 'f',
    created_at timestamp NOT NULL,
    updated_at timestamp
)