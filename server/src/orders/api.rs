use crate::{
    ballet_classes::model::BalletClass, bookings::model::Booking, db::connection,
    error_handler::CustomError, schema::orders,
};
use chrono::Utc;
use diesel::prelude::*;
use uuid::Uuid;

use super::model::Order;

impl Order {
    pub fn create(class_id: Uuid, order_id: &str) -> Result<Order, CustomError> {
        BalletClass::get_one(class_id)?;

        let conn = connection()?;

        let order = Order {
            id: order_id.to_owned(),
            completed: false,
            transaction_id: None,
            class_id: class_id,
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

            let class_id = order.class_id;

            Booking::create(class_id, client_id)?;

            Ok(())
        })?;
        Ok(())
    }

    pub fn delete(order_id: &str) -> Result<(), CustomError> {
        let conn = connection()?;

        diesel::delete(orders::table.find(order_id)).execute(&conn)?;

        Ok(())
    }
}
