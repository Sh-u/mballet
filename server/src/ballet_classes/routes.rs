use actix_session::Session;
use actix_web::{get, post, web, HttpResponse};
use serde_json::json;
use uuid::Uuid;

use crate::{
    ballet_classes::model::{BalletClass, ClassName, CourseName, CreateClassInput},
    bookings::model::Booking,
    error_handler::CustomError,
    users::auth_utils::get_current_user,
};

#[get("/classes/{class_id}")]
pub async fn get_all_by_class_id(class_id: web::Path<String>) -> Result<HttpResponse, CustomError> {
    let class_id = Uuid::parse_str(&class_id.into_inner());

    if let Err(err) = class_id {
        return Err(CustomError::new(
            500,
            format!("parse error: {}", err).as_str(),
        ));
    }

    let bookings = Booking::get_all_by_class(class_id.unwrap())?;

    Ok(HttpResponse::Ok().json(bookings))
}

#[get("/classes/available/{class_name}")]
pub async fn get_all_available_by_name(
    class_name: web::Path<String>,
) -> Result<HttpResponse, CustomError> {
    let classes = BalletClass::get_all_available_by_name(&class_name.into_inner())?;

    Ok(HttpResponse::Ok().json(classes))
}

#[get("/classes/booked_by/{userId}")]
pub async fn get_all_booked_by_user(user_id: web::Path<i32>) -> Result<HttpResponse, CustomError> {
    let classes = BalletClass::get_all_booked_by_user(user_id.into_inner())?;

    Ok(HttpResponse::Ok().json(classes))
}

#[get("/classes/sold_out/{class_name}")]
pub async fn check_sold_out_by_name(
    class_name: web::Path<String>,
) -> Result<HttpResponse, CustomError> {
    let classes = BalletClass::get_all_available_by_name(&class_name.into_inner())?;
    let sold_out = classes.is_empty();
    Ok(HttpResponse::Ok().json(json!({ "soldOut": sold_out })))
}

#[get("/classes")]
pub async fn get_all() -> Result<HttpResponse, CustomError> {
    let classes = BalletClass::get_all()?;
    Ok(HttpResponse::Ok().json(classes))
}

#[post("/classes")]
pub async fn create(
    input: web::Json<CreateClassInput>,
    session: Session,
) -> Result<HttpResponse, CustomError> {
    let input = input.into_inner();

    let (date, user_id) = (input.date, get_current_user(&session)?);

    // println!("before naive utc: {}", date.clone());
    let class = BalletClass::create(date, user_id, &input.class_name)?;

    Ok(HttpResponse::Ok().json(class))
}

#[get("/classes/{name}/price")]
pub async fn get_price(class_name: web::Path<String>) -> Result<HttpResponse, CustomError> {
    let lesson_name = class_name.into_inner();

    let lesson_type = ClassName::from_str(&lesson_name)?;

    let price = lesson_type.get_lesson_price();

    Ok(HttpResponse::Ok().body(price))
}

#[get("/courses/{name}/price")]
pub async fn get_course_price(course_name: web::Path<String>) -> Result<HttpResponse, CustomError> {
    let course_name = course_name.into_inner();

    let course_name = CourseName::from_str(&course_name)?;

    let price = course_name.get_price();

    Ok(HttpResponse::Ok().body(price))
}

pub fn init_routes(config: &mut web::ServiceConfig) {
    config.service(get_all_by_class_id);
    config.service(get_all_available_by_name);
    config.service(get_all);
    config.service(create);
    config.service(get_price);
    config.service(get_course_price);
    config.service(check_sold_out_by_name);
    config.service(get_all_booked_by_user);
}
