-- Your SQL goes here


CREATE TABLE bookings (
    id UUID NOT NULL PRIMARY KEY,
    booked_at TIMESTAMP NOT NULL ,
    booked_by INT references users(id),
    created_at TIMESTAMP NOT NULL
);
