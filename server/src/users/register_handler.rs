use std::str::FromStr;

use actix_session::Session;
use actix_web::{get, post, web, HttpResponse};
use serde::{Deserialize, Serialize};
use serde_json::json;

use super::auth_utils::is_signed_in;
use super::email_service::send_confirmation_mail;
use super::model::{Confirmation, User};
use crate::db::connection;
use crate::error_handler::CustomError;
use crate::schema::confirmations;
use diesel::RunQueryDsl;

#[derive(Serialize, Deserialize)]
pub struct RegisterData {
    pub email: String,
}
#[derive(Serialize, Deserialize)]

pub struct ConfirmationId {
    pub uuid: String,
}

pub fn create_confirmation(email: String) -> Result<uuid::Uuid, CustomError> {
    let confirmation = insert_record(email)?;

    send_confirmation_mail(&confirmation)?;

    Ok(confirmation.id)
}

fn insert_record(email: String) -> Result<Confirmation, CustomError> {
    let conn = connection()?;
    let new_record: Confirmation = email.into();

    let inserted = diesel::insert_into(confirmations::table)
        .values(&new_record)
        .get_result::<Confirmation>(&conn)?;

    Ok(inserted)
}
