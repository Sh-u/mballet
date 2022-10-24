table! {
    ballet_classes (id) {
        id -> Uuid,
        class_type -> Text,
        class_name -> Text,
        class_date -> Timestamp,
        slots -> Nullable<Int4>,
        created_at -> Timestamp,
    }
}

table! {
    bookings (id) {
        id -> Uuid,
        booked_at -> Timestamp,
        booked_by -> Int4,
        ballet_class -> Uuid,
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
    order_details (id) {
        id -> Uuid,
        order_id -> Text,
        product_id -> Uuid,
        created_at -> Timestamp,
    }
}

table! {
    orders (id) {
        id -> Text,
        completed -> Bool,
        transaction_id -> Nullable<Text>,
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

joinable!(bookings -> ballet_classes (ballet_class));
joinable!(bookings -> users (booked_by));
joinable!(order_details -> ballet_classes (product_id));
joinable!(order_details -> orders (order_id));

allow_tables_to_appear_in_same_query!(
    ballet_classes,
    bookings,
    confirmations,
    order_details,
    orders,
    posts,
    users,
);
