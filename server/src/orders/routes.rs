use actix_session::Session;
use actix_web::{post, web, HttpResponse};

use crate::{
    ballet_classes::model::BalletClass,
    bookings::model::CreateBookingInput,
    error_handler::CustomError,
    orders::{
        model::Order,
        payment_utils::{capture_payment, create_order},
    },
    users::auth_utils::get_current_user,
};

#[post("/orders")]
pub async fn orders(
    input: web::Json<CreateBookingInput>,
    session: Session,
) -> Result<HttpResponse, CustomError> {
    get_current_user(&session)?;
    let input = input.into_inner();
    let class = BalletClass::check_available(input.class_id)?;

    if class.is_none() {
        return Err(CustomError::new(
            400,
            "Creating order failed: This class is already booked.",
        ));
    }

    let paypal_order = create_order(class.unwrap().class_name, input.is_course).await?;
    Order::create(input.class_id, &paypal_order.id)?;

    Ok(HttpResponse::Ok().json(paypal_order))
}

#[post("/orders/{order_id}/capture")]
pub async fn orders_capture(
    order_id: web::Path<String>,
    session: Session,
) -> Result<HttpResponse, CustomError> {
    println!("capture```````````````````````````````");
    let order_id = order_id.into_inner();

    let client_id = dbg!(get_current_user(&session)?);

    let payment_response = capture_payment(&order_id).await?;

    let transaction_id = payment_response
        .purchase_units
        .get(0)
        .unwrap()
        .payments
        .captures
        .get(0)
        .unwrap()
        .id
        .clone();

    if payment_response.status == "COMPLETED" {
        Order::complete(&payment_response.id, client_id, &transaction_id)?;
    }

    Ok(HttpResponse::Ok().json(payment_response))
}

pub fn init_routes(config: &mut web::ServiceConfig) {
    config.service(orders);
    config.service(orders_capture);
}
