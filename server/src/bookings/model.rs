use crate::ballet_classes::model::BalletClass;
use crate::schema::bookings;
use crate::users::model::User;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

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
#[belongs_to(User, foreign_key = "booked_by")]
#[belongs_to(BalletClass, foreign_key = "ballet_class")]
#[table_name = "bookings"]
pub struct Booking {
    pub id: Uuid,
    pub booked_at: chrono::NaiveDateTime,
    pub booked_by: i32,
    pub ballet_class: Uuid,
}

#[derive(Serialize, Deserialize)]
pub struct CreateBookingInput {
    pub class_id: Uuid,
    pub is_course: Option<bool>,
}
