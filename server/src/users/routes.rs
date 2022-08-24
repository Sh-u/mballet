use actix_web::{delete, get, post, put, web, HttpResponse};
use serde_json::json;

use crate::{error_handler::CustomError, users::model::User};

use super::model::UsersApiBody;

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
// #[get("/users")]
// async fn find_all() -> Result<HttpResponse, CustomError> {
//     let employees = web::block(|| Users::find_all()).await.unwrap();
//     Ok(HttpResponse::Ok().json(employees))
// }
// #[get("/users/{id}")]
// async fn find(id: web::Path) -> Result<HttpResponse, CustomError> {
//     let employee = Users::find(id.into_inner())?;
//     Ok(HttpResponse::Ok().json(employee))
// }
// #[post("/users")]
// async fn create(employee: web::Json) -> Result<HttpResponse, CustomError> {
//     let employee = Users::create(employee.into_inner())?;
//     Ok(HttpResponse::Ok().json(employee))
// }
// #[put("/users/{id}")]
// async fn update(id: web::Path<u32>, employee: web::Json) -> Result<HttpResponse, CustomError> {
//     let employee = ::Users(id.into_inner(), employee.into_inner())?;
//     Ok(HttpResponse::Ok().json(employee))
// }
// #[delete("/users/{id}")]
// async fn delete(id: web::Path<u32>) -> Result<HttpResponse, CustomError> {
//     let deleted_employee = Users::delete(id.into_inner())?;
//     Ok(HttpResponse::Ok().json(json!({ "deleted": deleted_employee })))
// }

pub fn init_routes(config: &mut web::ServiceConfig) {
    config.service(get_all);
    config.service(create);
    config.service(update);
    config.service(delete);
}
