use crate::schema::users::{self, email};
use crate::{db::connection, error_handler::CustomError};
use chrono::Utc;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use validator::{validate_email, validate_range, Validate};

#[derive(Serialize, Deserialize, AsChangeset, Queryable, Validate)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub is_admin: bool,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Serialize, Deserialize)]
pub struct UsersApiBody {
    pub username: String,
    pub email: String,
}

#[derive(Insertable, AsChangeset, Deserialize, Debug)]
#[table_name = "users"]
pub struct NewUser {
    pub username: String,
    pub email: String,
    pub is_admin: bool,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

impl User {
    pub fn create(input: UsersApiBody) -> Result<User, CustomError> {
        let user = NewUser {
            username: input.username.to_owned(),
            email: input.email.to_owned(),
            is_admin: true,
            created_at: Utc::now().naive_utc(),
            updated_at: Some(Utc::now().naive_utc()),
        };

        let conn = connection()?;
        // if user.username.len() < 3 || user.email.len() < 5 {
        //     return Err(CustomError::new(400, "Your input is too short!"));
        // }

        if !validate_range(input.username.len(), Some(4), Some(15)) {
            return Err(CustomError::new(400, "Username is too short!"));
        }
        if !validate_email(input.email) {
            return Err(CustomError::new(400, "Incorrect email address!"));
        }

        if users::table
            .filter(users::username.eq(input.username))
            .execute(&conn)
            == Ok(1 as usize)
        {
            println!("username error");
            return Err(CustomError::new(400, "username already exists!"));
        }

        let user = diesel::insert_into(users::table)
            .values(user)
            .get_result(&conn)?;

        Ok(user)
    }

    pub fn get_all() -> Result<Vec<User>, CustomError> {
        let conn = connection()?;

        let users = users::table.load::<User>(&conn)?;

        Ok(users)
    }

    pub fn get_one(id: i32) -> Result<User, CustomError> {
        let conn = connection()?;

        let user = users::table.find(id).get_result::<User>(&conn)?;

        Ok(user)
    }

    pub fn delete_one(id: i32) -> Result<bool, CustomError> {
        let conn = connection()?;

        diesel::delete(users::table.find(id)).execute(&conn)?;

        Ok(true)
    }

    pub fn update(id: i32, input: UsersApiBody) -> Result<User, CustomError> {
        let conn = connection()?;

        let user = diesel::update(users::table.find(id))
            .set((
                users::username.eq(input.username),
                users::email.eq(input.email),
                users::updated_at.eq(Utc::now().naive_utc()),
            ))
            .get_result(&conn)?;

        Ok(user)
    }
}
