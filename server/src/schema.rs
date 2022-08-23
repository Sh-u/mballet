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
        email -> Text,
        is_admin -> Bool,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

allow_tables_to_appear_in_same_query!(
    posts,
    users,
);
