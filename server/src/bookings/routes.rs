use crate::{
    bookings::model::{Booking, CreateBookingInput},
    error_handler::CustomError,
    users::auth_utils::get_current_user,
};
use actix_session::Session;
use actix_web::{get, post, put, web, HttpResponse};

use serde_json::json;

use super::model::BookBookingInput;
#[get("/bookings")]
pub async fn get_all() -> Result<HttpResponse, CustomError> {
    let bookings = Booking::get_all()?;
    Ok(HttpResponse::Ok().json(bookings))
}

#[get("/bookings_available")]
pub async fn get_all_available() -> Result<HttpResponse, CustomError> {
    let bookings = Booking::get_all_available()?;
    Ok(HttpResponse::Ok().json(bookings))
}

#[get("/bookings/{user_id}")]
pub async fn get_all_by_user_id(path: web::Path<i32>) -> Result<HttpResponse, CustomError> {
    let user_bookings = Booking::get_all_by_user_id(path.into_inner())?;

    Ok(HttpResponse::Ok().json(user_bookings))
}

#[post("/bookings")]
pub async fn create(
    input: web::Json<CreateBookingInput>,
    session: Session,
) -> Result<HttpResponse, CustomError> {
    let input = input.into_inner();

    let (date, user_id) = (input.date, get_current_user(&session)?);

    println!("before naive utc: {}", date.clone());
    let booking = Booking::create(date, user_id)?;

    Ok(HttpResponse::Ok().json(booking))
}

#[put("/bookings")]
pub async fn book(
    input: web::Json<BookBookingInput>,
    session: Session,
) -> Result<HttpResponse, CustomError> {
    Booking::book(input.into_inner().booking_id, get_current_user(&session)?)?;

    Ok(HttpResponse::Ok().json(json!({
        "message": "You successfully booked your lesson!"
    })))
}

pub fn init_routes(config: &mut web::ServiceConfig) {
    config.service(get_all);
    config.service(get_all_by_user_id);
    config.service(get_all_available);
    config.service(create);
    config.service(book);
}
