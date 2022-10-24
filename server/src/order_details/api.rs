use super::model::OrderDetails;
use crate::diesel::RunQueryDsl;
use crate::{db::connection, error_handler::CustomError, schema::order_details};
use chrono;

impl OrderDetails {
    pub fn create(
        order_id: String,
        product_ids: Vec<uuid::Uuid>,
    ) -> Result<Vec<Self>, CustomError> {
        let conn = connection()?;

        let mut orders = Vec::with_capacity(product_ids.len());

        for id in product_ids {
            let order = OrderDetails {
                id: uuid::Uuid::new_v4(),
                order_id: order_id.to_owned(),
                product_id: id,
                created_at: chrono::Utc::now().naive_utc(),
            };

            orders.push(order);
        }

        let details = diesel::insert_into(order_details::table)
            .values(orders)
            .get_results(&conn)?;

        Ok(details)
    }
}
