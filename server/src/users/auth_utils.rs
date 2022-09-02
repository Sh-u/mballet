use crate::error_handler::CustomError;
use actix_session::Session;
use argonautica::{Hasher, Verifier};

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

pub fn set_current_user(session: &Session, user_id: i32) -> () {
    session
        .insert("user", user_id)
        .expect("Inserting user into the session failed");
}

pub fn get_current_user(session: &Session) -> Result<i32, CustomError> {
    if let Some(id) = session.get("user")? {
        return Ok(id);
    } else {
        return Err(CustomError::new(
            401,
            format!("Getting user from the session failed:").as_str(),
        ));
    }
}
