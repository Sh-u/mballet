use actix_session::Session;
use actix_web::{delete, get, post, put, web, HttpResponse};
use serde_json::json;

use crate::{
    error_handler::CustomError,
    users::{auth_utils::is_signed_in, model::User},
};

use super::model::UsersApiBody;

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

pub fn init_routes(config: &mut web::ServiceConfig) {
    config.service(get_all);
    config.service(create);
    config.service(update);
    config.service(delete);
}
