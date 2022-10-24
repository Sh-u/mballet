use super::model::Booking;
use crate::{
    ballet_classes::model::BalletClass,
    db::connection,
    error_handler::CustomError,
    schema::{bookings, users},
    users::model::User,
};
use chrono::Utc;
use diesel::prelude::*;
use uuid::Uuid;

impl Booking {
    pub fn get_all_by_user_id(user_id: i32) -> Result<Vec<Booking>, CustomError> {
        let conn = connection()?;
        let user = users::table.find(user_id).get_result::<User>(&conn)?;
        let bookings = Booking::belonging_to(&user).load(&conn)?;

        Ok(bookings)
    }

    pub fn get_all() -> Result<Vec<Booking>, CustomError> {
        let conn = connection()?;
        Ok(bookings::table.load::<Booking>(&conn)?)
    }

    pub fn get_all_by_class(class_id: Uuid) -> Result<Vec<Booking>, CustomError> {
        let conn = connection()?;

        Ok(bookings::table
            .filter(bookings::ballet_class.eq(class_id))
            .order(bookings::booked_at)
            .load::<Booking>(&conn)?)
    }

    pub fn create(class_id: Uuid, client_id: i32) -> Result<Booking, CustomError> {
        let conn = connection()?;

        let class = BalletClass::check_available(class_id)?;

        if class.is_none() {
            return Err(CustomError::new(
                400,
                "Completing order failed: This class is already booked.",
            ));
        }
        let class = class.unwrap();

        let booking = Booking {
            id: Uuid::new_v4(),
            booked_at: Utc::now().naive_utc(),
            booked_by: client_id,
            ballet_class: class.id,
        };

        let booking = diesel::insert_into(bookings::table)
            .values(booking)
            .get_result::<Booking>(&conn)?;

        Ok(booking)
    }

    pub fn delete(booking_id: Uuid) -> Result<bool, CustomError> {
        let conn = connection()?;
        diesel::delete(bookings::table.find(booking_id)).execute(&conn)?;

        Ok(true)
    }

    pub fn get_one(booking_id: Uuid) -> Result<Booking, CustomError> {
        let conn = connection()?;

        let booking = bookings::table.find(booking_id).get_result(&conn)?;

        Ok(booking)
    }
}
