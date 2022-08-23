use crate::schema::users;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, AsChangeset, Queryable)]
pub struct User {
    pub id: u32,
    pub username: String,
    pub is_admin: bool,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Serialize, Deserialize)]
pub struct UsersApiBody {
    pub username: String,
    pub email: String,
}

#[derive(Insertable, Debug)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub username: &'a str,
    pub email: &'a str,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}
