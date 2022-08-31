use std::str::FromStr;

use crate::{
    error_handler::CustomError,
    users::{
        auth_utils::{get_current_user, is_signed_in},
        model::{Confirmation, SessionUser, User},
        register_handler::{create_confirmation, RegisterData},
    },
};
use actix_session::Session;
use actix_web::{delete, get, post, put, web, HttpResponse};
use serde::Deserialize;
use serde_json::json;

use super::model::{Credentials, UsersApiBody};

#[post("users")]
async fn create(
    input: web::Json<UsersApiBody>,
    session: Session,
) -> Result<HttpResponse, CustomError> {
    let user = User::create(input.into_inner())?;

    Ok(HttpResponse::Ok().json(user))
}

#[put("users/{id}")]
async fn update(
    id: web::Path<i32>,
    input: web::Json<UsersApiBody>,
) -> Result<HttpResponse, CustomError> {
    let user = User::update(id.into_inner(), input.into_inner())?;

    Ok(HttpResponse::Ok().json(user))
}

#[delete("users/{id}")]
async fn delete(id: web::Path<i32>) -> Result<HttpResponse, CustomError> {
    User::delete_one(id.into_inner())?;

    Ok(HttpResponse::Ok().json(json!({
        "message": "User successfully deleted!"
    })))
}

#[get("users")]
async fn get_all() -> Result<HttpResponse, CustomError> {
    let users = web::block(|| User::get_all())
        .await
        .expect("error getting all users")
        .expect("error getting all users 2");

    Ok(HttpResponse::Ok().json(users))
}

#[get("/register/{uuid}")]
pub async fn get_confirmation(uuid: web::Path<String>) -> Result<HttpResponse, CustomError> {
    println!("uuid");
    let uuid = uuid::Uuid::from_str(uuid.into_inner().as_str()).unwrap();
    println!("uuid: {}", uuid);
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

#[post("/register/{path_id}")]
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

#[post("/login")]
pub async fn login(
    session: Session,
    credentials: web::Json<Credentials>,
) -> Result<HttpResponse, CustomError> {
    if is_signed_in(&session) {
        return Err(CustomError::new(
            400,
            "Creating user failed. The user is already signed in.",
        ));
    }

    let user = User::login(session, credentials.into_inner())?;

    Ok(HttpResponse::Ok().json(user))
}

#[get("/me")]
pub async fn me(session: Session) -> Result<HttpResponse, CustomError> {
    let session_user: SessionUser = get_current_user(&session)?;

    let user = User::get_one(session_user.id)?;

    Ok(HttpResponse::Ok().json(user))
}

pub fn init_routes(config: &mut web::ServiceConfig) {
    config.service(get_all);
    config.service(create);
    config.service(update);
    config.service(delete);
    config.service(get_confirmation);
    config.service(send_confirmation);
    config.service(confirm_creation);
    config.service(me);
    config.service(login);
}
