use actix_session::Session;

use crate::{
    error_handler::CustomError,
    users::{auth_utils::get_current_user, model::User},
};

pub fn check_is_admin(session: &Session) -> Result<(), CustomError> {
    let user_id = get_current_user(&session)?;

    let user = User::get_one(user_id)?;

    if !user.is_admin {
        return Err(CustomError::new(401, "Requires admin privilages."));
    }
    Ok(())
}
