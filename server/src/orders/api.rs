use crate::{
    ballet_classes::model::BalletClass, bookings::model::Booking, db::connection,
    error_handler::CustomError, order_details::model::OrderDetails, schema::orders,
};
use chrono::Utc;
use diesel::prelude::*;
use uuid::Uuid;

use super::{
    model::{Order, PaypalCreateOrderResponse},
    payment_utils::create_order,
};

impl Order {
    pub fn create(order_id: &str) -> Result<Order, CustomError> {
        let conn = connection()?;

        let order = Order {
            id: order_id.to_owned(),
            completed: false,
            transaction_id: None,
            created_at: Utc::now().naive_utc(),
        };

        let order = diesel::insert_into(orders::table)
            .values(order)
            .get_result(&conn)?;

        Ok(order)
    }

    pub fn complete(
        order_id: &str,
        client_id: i32,
        transaction_id: &str,
    ) -> Result<(), CustomError> {
        let conn = connection()?;

        conn.transaction::<_, CustomError, _>(|| {
            let order: Order = diesel::update(orders::table.find(order_id))
                .set((
                    orders::completed.eq(true),
                    orders::transaction_id.eq(transaction_id),
                ))
                .get_result(&conn)?;

            let order_details: Vec<OrderDetails> =
                OrderDetails::belonging_to(&order).load::<OrderDetails>(&conn)?;

            for details in order_details {
                Booking::create(details.product_id, client_id)?;
            }

            Ok(())
        })?;
        Ok(())
    }

    pub async fn init_order(
        product_ids: Vec<Uuid>,
        classes: &Vec<BalletClass>,
    ) -> Result<PaypalCreateOrderResponse, CustomError> {
        let conn = connection()?;

        let paypal_order = create_order(classes).await?;

        conn.transaction::<_, CustomError, _>(|| {
            let order = Order::create(&paypal_order.id)?;
            OrderDetails::create(order.id, product_ids)?;

            Ok(())
        })?;

        Ok(paypal_order)
    }

    pub fn delete(order_id: &str) -> Result<(), CustomError> {
        let conn = connection()?;

        diesel::delete(orders::table.find(order_id)).execute(&conn)?;

        Ok(())
    }
}
