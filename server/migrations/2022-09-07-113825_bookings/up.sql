-- Your SQL goes here


CREATE TABLE bookings (
    id UUID NOT NULL PRIMARY KEY,
    lesson_type TEXT,
    is_confirmed BOOLEAN NOT NULL DEFAULT 'f',
    booked_at TIMESTAMP NOT NULL ,
    booked_by INT references users(id),
    created_at TIMESTAMP NOT NULL
);
