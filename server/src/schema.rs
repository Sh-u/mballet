table! {
    confirmations (id) {
        id -> Uuid,
        email -> Text,
        expires_at -> Timestamp,
    }
}

table! {
    posts (id) {
        id -> Int4,
        title -> Varchar,
        body -> Varchar,
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
        is_admin -> Bool,
        is_confirmed -> Bool,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

allow_tables_to_appear_in_same_query!(
    confirmations,
    posts,
    users,
);
