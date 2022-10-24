use super::model::CreateBookingInput;
use crate::{
    bookings::model::Booking, error_handler::CustomError, users::auth_utils::get_current_user,
};
use actix_session::Session;
use actix_web::{get, put, web, HttpResponse};
use serde_json::json;

#[get("/bookings")]
pub async fn get_all() -> Result<HttpResponse, CustomError> {
    let bookings = Booking::get_all()?;
    Ok(HttpResponse::Ok().json(bookings))
}

#[get("/bookings/user/{user_id}")]
pub async fn get_all_by_user_id(path: web::Path<i32>) -> Result<HttpResponse, CustomError> {
    let user_bookings = Booking::get_all_by_user_id(path.into_inner())?;

    Ok(HttpResponse::Ok().json(user_bookings))
}

#[put("/bookings")]
pub async fn create_booking(
    input: web::Json<CreateBookingInput>,
    session: Session,
) -> Result<HttpResponse, CustomError> {
    let user_id = get_current_user(&session)?;
    let input = input.into_inner();

    Booking::create(input.class_id, user_id)?;

    Ok(HttpResponse::Ok().json(json!({
        "message": "You have successfully booked your lesson!"
    })))
}

pub fn init_routes(config: &mut web::ServiceConfig) {
    config.service(get_all);
    config.service(get_all_by_user_id);
    config.service(create_booking);
}
