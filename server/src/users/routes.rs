// use actix_web::{
//     delete, get, middleware::Logger, post, put, web, App, HttpResponse, HttpServer, Responder,
// };

// use crate::error_handler::CustomError;
// use crate::users::model::Users;

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
// pub fn init_routes(config: &mut web::ServiceConfig) {
//     config.service(find_all);
//     config.service(find);
//     config.service(create);
//     config.service(update);
//     config.service(delete);
// }
