-- Your SQL goes here

CREATE TABLE ballet_classes (
    id UUID NOT NULL PRIMARY KEY,
    class_type TEXT NOT NULL,
    class_name TEXT NOT NULL,
    class_date TIMESTAMP NOT NULL,
    slots INT,
    created_at TIMESTAMP NOT NULL
);