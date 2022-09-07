use super::model::Confirmation;
use super::{email_service::send_confirmation_mail, model::MailInfo};
use crate::db::connection;
use crate::error_handler::CustomError;
use crate::schema::confirmations;
use diesel::RunQueryDsl;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct RegisterData {
    pub email: String,
}
#[derive(Serialize, Deserialize)]

pub struct ConfirmationId {
    pub uuid: String,
}

pub fn create_confirmation(email: String, info: MailInfo) -> Result<uuid::Uuid, CustomError> {
    let confirmation = insert_record(email)?;

    send_confirmation_mail(&confirmation, info)?;

    Ok(confirmation.id)
}

fn insert_record(email: String) -> Result<Confirmation, CustomError> {
    let conn = connection()?;
    let new_record: Confirmation = email.into();

    let inserted = diesel::insert_into(confirmations::table)
        .values(&new_record)
        .get_result::<Confirmation>(&conn);

    match inserted {
        Ok(v) => Ok(v),
        Err(_) => Err(CustomError::new(400, "Email already sent.")),
    }
}
