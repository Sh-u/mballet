-- Your SQL goes here

CREATE TABLE ballet_classes (
    id UUID NOT NULL PRIMARY KEY,
    class_type TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    class_date TIMESTAMP
);