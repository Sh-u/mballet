use actix_session::Session;

use crate::error_handler::CustomError;
use argonautica::{Hasher, Verifier};

use super::model::SessionUser;

pub fn hash_password(password: &str) -> Result<String, CustomError> {
    Hasher::default()
        .with_password(password)
        .with_secret_key(std::env::var("SECRET_KEY").expect("set the SECRET KEY env"))
        .hash()
        .map_err(|_| CustomError::new(401, "Hashing user password failed"))
}

pub fn verify(password: &str, hash: &str) -> Result<bool, CustomError> {
    Verifier::default()
        .with_hash(hash)
        .with_password(password)
        .with_secret_key(std::env::var("SECRET_KEY").expect("set the SECRET KEY env"))
        .verify()
        .map_err(|_| CustomError::new(401, "Veryfing user password failed"))
}

pub fn is_signed_in(session: &Session) -> bool {
    match get_current_user(session) {
        Ok(_) => true,
        _ => false,
    }
}

pub fn set_current_user(session: &Session, user: &SessionUser) -> () {
    session
        .insert("user", user)
        .expect("Inserting user into the session failed");
}

pub fn get_current_user(session: &Session) -> Result<SessionUser, CustomError> {
    let user = session
        .get::<SessionUser>("user")
        .map_err(|_| {
            return CustomError::new(401, "Getting user from the session failed");
        })
        .unwrap();

    println!("get user: {:?}", user);

    if user.is_none() {
        Err(CustomError::new(
            401,
            "Getting user from the session failed",
        ))
    } else {
        println!("found user");
        Ok(user.unwrap())
    }
}
