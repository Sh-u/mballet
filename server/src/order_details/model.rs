use serde::{Deserialize, Serialize};

use crate::schema::order_details;
use crate::{ballet_classes::model::BalletClass, orders::model::Order};

#[derive(
    Identifiable,
    Queryable,
    Associations,
    Debug,
    Insertable,
    Serialize,
    Deserialize,
    QueryableByName,
)]
#[belongs_to(Order, foreign_key = "order_id")]
#[belongs_to(BalletClass, foreign_key = "product_id")]
#[table_name = "order_details"]
pub struct OrderDetails {
    pub id: uuid::Uuid,
    pub order_id: String,
    pub product_id: uuid::Uuid,
    pub created_at: chrono::NaiveDateTime,
}
