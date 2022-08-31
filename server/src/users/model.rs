use crate::schema::confirmations;
use crate::schema::users::{self, email};
use crate::{db::connection, error_handler::CustomError};
use actix_session::Session;
use chrono::Utc;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::{validate_email, validate_range, Validate};

use super::auth_utils::{hash_password, set_current_user, verify};

#[derive(Deserialize, Serialize)]
pub struct Credentials {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, AsChangeset, Queryable, Validate)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password: String,
    pub email: String,
    pub is_admin: bool,
    pub is_confirmed: bool,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}
#[derive(Serialize, Deserialize, Insertable, Queryable)]
#[table_name = "confirmations"]
pub struct Confirmation {
    pub id: Uuid,
    pub email: String,
    pub expires_at: chrono::NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct UsersApiBody {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SessionUser {
    pub id: i32,
    pub email: String,
}

#[derive(Insertable, AsChangeset, Deserialize, Debug)]
#[table_name = "users"]
pub struct NewUser {
    pub username: String,
    pub email: String,
    pub password: String,
    pub is_admin: bool,
    pub is_confirmed: bool,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

impl<T> From<T> for Confirmation
where
    T: Into<String> + Clone,
{
    fn from(mail: T) -> Self {
        Confirmation {
            id: Uuid::new_v4(),
            email: mail.into(),
            expires_at: Utc::now().naive_utc() + chrono::Duration::hours(24),
        }
    }
}

impl From<User> for SessionUser {
    fn from(user: User) -> Self {
        SessionUser {
            id: user.id,
            email: user.email,
        }
    }
}

impl Confirmation {
    pub fn get(uuid: Uuid) -> Result<Confirmation, CustomError> {
        let conn = connection()?;
        Ok(confirmations::table.find(uuid).get_result(&conn)?)
    }
}

impl User {
    pub fn create(input: UsersApiBody) -> Result<User, CustomError> {
        let conn = connection()?;
        // if user.username.len() < 3 || user.email.len() < 5 {
        //     return Err(CustomError::new(400, "Your input is too short!"));
        // }

        if !validate_range(input.username.len(), Some(4), Some(15)) {
            return Err(CustomError::new(400, "Username is too short!"));
        }
        if !validate_range(input.username.len(), Some(4), Some(15)) {
            return Err(CustomError::new(400, "Password is too short!"));
        }
        if !validate_email(&input.email) {
            return Err(CustomError::new(400, "Incorrect email address!"));
        }

        if users::table
            .filter(users::username.eq(&input.username))
            .execute(&conn)
            == Ok(1 as usize)
        {
            return Err(CustomError::new(400, "username already exists!"));
        }

        let user = NewUser {
            username: input.username.to_owned(),
            password: hash_password(input.password.as_str())?,
            email: input.email.to_owned(),
            is_admin: true,
            is_confirmed: false,
            created_at: Utc::now().naive_utc(),
            updated_at: Some(Utc::now().naive_utc()),
        };

        let user = diesel::insert_into(users::table)
            .values(user)
            .get_result(&conn)?;

        Ok(user)
    }

    pub fn confirm_creation(path_id: &str) -> Result<SessionUser, CustomError> {
        let path_id = Uuid::parse_str(path_id).unwrap();
        let conn = connection()?;

        let mut confirmation = confirmations::table
            .filter(confirmations::id.eq(path_id))
            .load::<Confirmation>(&conn)?;

        if let Some(confirmation) = confirmation.pop() {
            if Utc::now().naive_utc() < confirmation.expires_at {
                let updated_user =
                    diesel::update(users::table.filter(users::email.eq(confirmation.email)))
                        .set(users::is_confirmed.eq(true))
                        .get_result::<User>(&conn)?;

                diesel::delete(confirmations::table.find(path_id)).execute(&conn)?;
                return Ok(updated_user.into());
            }
            return Err(CustomError::new(410, "Confirmation link expired"));
        }
        return Err(CustomError::new(
            400,
            "Could not find a matching confirmation",
        ));
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

    pub fn login(session: Session, credentials: Credentials) -> Result<SessionUser, CustomError> {
        let conn = connection()?;

        let user = users::table
            .filter(users::email.eq(credentials.email))
            .get_result::<User>(&conn)?;

        if !verify(credentials.password.as_str(), user.password.as_str())? {
            return Err(CustomError::new(401, "Password does not match!"));
        }

        let session_user = SessionUser::from(user);
        set_current_user(&session, &session_user);

        Ok(session_user)
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
