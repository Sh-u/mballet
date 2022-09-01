use std::str::FromStr;

use crate::{
    error_handler::CustomError,
    users::{
        auth_utils::{get_current_user, hash_password, is_signed_in, verify},
        model::{Confirmation, SessionUser, User},
        register_handler::{create_confirmation, RegisterData},
    },
};
use actix_session::Session;
use actix_web::{
    cookie::{Cookie, SameSite},
    delete, get,
    http::header,
    post, put, web, HttpRequest, HttpResponse,
};
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

pub async fn testing(
    session: Session,
    credentials: web::Json<Credentials>,
) -> Result<HttpResponse, CustomError> {
    let cpy = credentials.into_inner().password.clone();

    // let hashed = hash_password(cpy.as_str())?;
    let hashed = "$argon2id$v=19$m=4096,t=192,p=12$gxcJJ5vAcvwpXvr1yuj2HD898QAS2i7hiLOkItZlyoc$QUT88YBeXGTFbEPRcjy3rEbNTRPbW1lUSyEaazizYCk";

    let unhashed = verify(cpy.as_str(), hashed)?;

    Ok(HttpResponse::Ok().json(json!({ "pass": unhashed })))
}

#[post("/testing")]
async fn index(session: Session, req: HttpRequest) -> Result<HttpResponse, CustomError> {
    log::info!("{req:?}");

    // RequestSession trait is used for session access
    let mut counter = 1;
    if let Some(count) = session.get::<i32>("counter")? {
        log::info!("SESSION value: {count}");
        counter = count + 1;
        session.insert("counter", counter)?;
    } else {
        session.insert("counter", counter)?;
    }

    Ok(HttpResponse::Ok().finish())
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

    Ok(HttpResponse::Ok().finish())
}

#[get("/me")]
pub async fn me(session: Session) -> Result<HttpResponse, CustomError> {
    println!("me session: {:#?}", session.entries());
    let session_user_id = get_current_user(&session)?;

    let user = User::get_one(session_user_id)?;

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
    config.service(index);
}
