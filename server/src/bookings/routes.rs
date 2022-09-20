use crate::{
    bookings::{
        model::{Booking, CreateBookingInput, LessonType, Order},
        payment_utils::{capture_payment, create_order},
    },
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

#[get("/bookings_available/{type}")]
pub async fn get_all_available_of_type(
    path: web::Path<String>,
) -> Result<HttpResponse, CustomError> {
    let bookings = Booking::get_all_available_of_type(path.into_inner().as_str())?;

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
    let booking = Booking::create(date, user_id, &input.lesson_type)?;

    Ok(HttpResponse::Ok().json(booking))
}

#[put("/bookings")]
pub async fn book(
    input: web::Json<BookBookingInput>,
    session: Session,
) -> Result<HttpResponse, CustomError> {
    let user_id = get_current_user(&session)?;
    let input = input.into_inner();

    Booking::book(input.booking_id, user_id)?;

    Ok(HttpResponse::Ok().json(json!({
        "message": "You successfully booked your lesson!"
    })))
}

#[post("/orders")]
pub async fn orders(
    input: web::Json<BookBookingInput>,
    session: Session,
) -> Result<HttpResponse, CustomError> {
    let user_id = get_current_user(&session)?;

    let input = input.into_inner();
    let lesson_type_str = Booking::get_lesson_type(input.booking_id)?;

    if lesson_type_str.is_none() {
        return Err(CustomError::new(
            400,
            "Looks like the lesson you're trying to book doesn't exist.",
        ));
    }

    let lesson_type_enum = LessonType::from_str(&lesson_type_str.unwrap())?;

    let db_order = Order::create(user_id, input.booking_id)?;
    let paypal_order = create_order(lesson_type_enum, db_order).await?;

    Ok(HttpResponse::Ok().json(paypal_order))
}

#[post("/orders/{order_id}/capture")]
pub async fn orders_capture(order_id: web::Path<i32>) -> Result<HttpResponse, CustomError> {
    let order_id = order_id.into_inner();

    let response = capture_payment(order_id).await?;

    Ok(HttpResponse::Ok().json(response))
}

pub fn init_routes(config: &mut web::ServiceConfig) {
    config.service(get_all);
    config.service(get_all_by_user_id);
    config.service(get_all_available);
    config.service(create);
    config.service(book);
    config.service(orders);
    config.service(orders_capture);
    config.service(get_all_available_of_type);
}
