use std::str::FromStr;

use actix_session::Session;
use actix_web::{get, post, web, HttpResponse};
use serde::{Deserialize, Serialize};

use super::auth_utils::is_signed_in;
use super::email_service::send_confirmation_mail;
use super::model::{Confirmation, User};
use crate::db::connection;
use crate::error_handler::CustomError;
use crate::schema::confirmations;
use diesel::RunQueryDsl;

#[derive(Serialize, Deserialize)]
pub struct RegisterData {
    email: String,
}
#[derive(Serialize, Deserialize)]

pub struct ConfirmationId {
    uuid: String,
}

#[get("/confirmation")]
pub async fn get_confirmation(
    uuid: web::Json<ConfirmationId>,
) -> Result<HttpResponse, CustomError> {
    let uuid = uuid::Uuid::from_str(uuid.into_inner().uuid.as_str()).unwrap();
    let confirmation = Confirmation::get(uuid)?;

    Ok(HttpResponse::Ok().json(confirmation))
}

#[post("/register")]
pub async fn send_confirmation(
    session: Session,
    data: web::Json<RegisterData>,
) -> Result<HttpResponse, CustomError> {
    if is_signed_in(&session) {
        return Err(CustomError::new(400, "already signed in!"));
    }

    let result = create_confirmation(data.into_inner().email);

    match result {
        Ok(_) => Ok(HttpResponse::Ok().finish()),
        Err(err) => Err(err),
    }
}

fn create_confirmation(email: String) -> Result<(), CustomError> {
    let confirmation = insert_record(email)?;

    send_confirmation_mail(&confirmation)
}

fn insert_record(email: String) -> Result<Confirmation, CustomError> {
    let conn = connection()?;
    let new_record: Confirmation = email.into();

    let inserted = diesel::insert_into(confirmations::table)
        .values(&new_record)
        .get_result::<Confirmation>(&conn)?;

    Ok(inserted)
}

#[post("/confirm/{path_id}")]
pub async fn confirm_creation(
    session: Session,
    path_id: web::Path<String>,
) -> Result<HttpResponse, CustomError> {
    if is_signed_in(&session) {
        return Err(CustomError::new(
            400,
            "Creating user failed. The user is already signed in.",
        ));
    }

    let session_user = User::confirm_creation(path_id.as_str())?;

    let result = session.insert("user", &session_user);

    match result {
        Ok(_) => Ok(HttpResponse::Ok().json(session_user)),
        Err(err) => Err(CustomError::new(
            500,
            format!("Error while creting a session user: {}", err).as_str(),
        )),
    }
}
