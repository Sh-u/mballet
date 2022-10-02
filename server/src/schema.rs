table! {
    bookings (id) {
        id -> Uuid,
        lesson_type -> Nullable<Text>,
        is_confirmed -> Bool,
        booked_at -> Timestamp,
        booked_by -> Nullable<Int4>,
        created_at -> Timestamp,
    }
}

table! {
    confirmations (id) {
        id -> Uuid,
        email -> Text,
        expires_at -> Timestamp,
    }
}

table! {
    orders (id) {
        id -> Uuid,
        email -> Text,
        booking_id -> Nullable<Uuid>,
        created_at -> Timestamp,
    }
}

table! {
    posts (id) {
        id -> Int4,
        title -> Varchar,
        body -> Varchar,
        img -> Nullable<Varchar>,
        published -> Bool,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

table! {
    users (id) {
        id -> Int4,
        username -> Text,
        password -> Text,
        email -> Text,
        img -> Nullable<Varchar>,
        is_admin -> Bool,
        is_confirmed -> Bool,
        auth_type -> Text,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

joinable!(bookings -> users (booked_by));
joinable!(orders -> bookings (booking_id));

allow_tables_to_appear_in_same_query!(
    bookings,
    confirmations,
    orders,
    posts,
    users,
);
