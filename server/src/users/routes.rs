use super::model::{Credentials, UsersApiBody};
use crate::{
    error_handler::CustomError,
    users::{
        auth_utils::{get_current_user, is_signed_in},
        model::{Confirmation, MailInfo, User},
        register_handler::{create_confirmation, RegisterData},
    },
};
use actix_session::Session;
use actix_web::{delete, get, post, put, web, HttpResponse};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::str::FromStr;

#[post("users")]
async fn create(input: web::Json<UsersApiBody>) -> Result<HttpResponse, CustomError> {
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
    let email = data.into_inner().email;

    let info = MailInfo {
        message: "Click on the link to reset your password.",
        path: "reset",
        title: "Mballet password reset",
    };

    let result = create_confirmation(email, info);

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

    User::login(session, credentials.into_inner())?;

    Ok(HttpResponse::Ok().finish())
}

#[derive(Serialize, Deserialize)]
pub struct ResetInput {
    email: String,
}

#[post("/reset")]
pub async fn reset(input: web::Json<ResetInput>) -> Result<HttpResponse, CustomError> {
    let email = input.into_inner().email;
    User::reset(&email)?;

    let info = MailInfo {
        message: "Click on the link to reset your password.",
        path: "reset",
        title: "Mballet password reset",
    };

    create_confirmation(email, info)?;

    Ok(HttpResponse::Ok().finish())
}

#[post("/reset/{path_id}")]
pub async fn confirm_reset(
    path_id: web::Path<String>,
    input: web::Json<Credentials>,
) -> Result<HttpResponse, CustomError> {
    User::confirm_reset(path_id.as_str(), input.into_inner().password.as_str())?;

    Ok(HttpResponse::Ok().finish())
}

#[get("/me")]
pub async fn me(session: Session) -> Result<HttpResponse, CustomError> {
    println!("me session: {:#?}", session.entries());
    let session_user_id = get_current_user(&session)?;

    let user = User::get_one(session_user_id)?;

    Ok(HttpResponse::Ok().json(user))
}

#[post("/logout")]
pub async fn logout(session: Session) -> Result<HttpResponse, CustomError> {
    if !is_signed_in(&session) {
        return Err(CustomError::new(400, "There is no one signed in"));
    }

    session.purge();

    Ok(HttpResponse::Ok().finish())
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
    config.service(logout);
    config.service(reset);
}
