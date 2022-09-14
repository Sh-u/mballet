use crate::{
    db::connection, error_handler::CustomError, schema::bookings, schema::users, users::model::User,
};
use chrono::{NaiveDateTime, Utc};
use diesel::{prelude::*, sql_query};

use diesel::query_dsl::RunQueryDsl;
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
#[table_name = "bookings"]
pub struct Booking {
    pub id: Uuid,
    pub booked_at: chrono::NaiveDateTime,
    pub booked_by: Option<i32>,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct CreateBookingInput {
    pub date: chrono::DateTime<chrono::Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct BookBookingInput {
    pub booking_id: Uuid,
}

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

    pub fn get_all_available() -> Result<Vec<Booking>, CustomError> {
        let conn = connection()?;

        Ok(bookings::table
            .filter(bookings::booked_by.is_null())
            .filter(bookings::booked_at.ge(Utc::now().naive_utc()))
            .order(bookings::booked_at)
            .load::<Booking>(&conn)?)
    }

    pub fn book(booking_id: Uuid, client_id: i32) -> Result<bool, CustomError> {
        let conn = connection()?;

        let booking: Booking = bookings::table.find(booking_id).first(&conn)?;

        if !booking.booked_by.is_none() {
            return Err(CustomError::new(400, "This booking is already taken."));
        }

        diesel::update(&booking)
            .set(bookings::booked_by.eq(Some(client_id)))
            .execute(&conn)?;

        Ok(true)
    }

    pub fn create(date: chrono::DateTime<Utc>, user_id: i32) -> Result<Booking, CustomError> {
        let conn = connection()?;
        let caller = users::table.find(user_id).get_result::<User>(&conn)?;

        if !caller.is_admin {
            return Err(CustomError::new(
                400,
                "This action requires admin privileges.",
            ));
        }

        let booking = Booking {
            id: Uuid::new_v4(),
            booked_at: date.naive_utc(),
            booked_by: None,
            created_at: Utc::now().naive_utc(),
        };

        if booking.booked_at <= Utc::now().naive_utc() {
            return Err(CustomError::new(400, "Please enter a valid date."));
        }

        let same_time = sql_query(
            format!(
                "SELECT id from bookings where date_trunc('minutes', booked_at) = '{}'",
                booking.booked_at.format("%Y-%m-%d %H:%M:00")
            )
            .as_str(),
        )
        .execute(&conn)?;

        if same_time > 0 {
            return Err(CustomError::new(
                400,
                "Booking at this time already exists.",
            ));
        }

        let booking = diesel::insert_into(bookings::table)
            .values(booking)
            .get_result(&conn)?;

        Ok(booking)
    }

    pub fn delete(booking_id: Uuid) -> Result<bool, CustomError> {
        let conn = connection()?;
        diesel::delete(bookings::table.find(booking_id)).execute(&conn)?;

        Ok(true)
    }
}
