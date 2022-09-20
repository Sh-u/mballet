use crate::{
    db::connection, error_handler::CustomError, schema::bookings, schema::orders, schema::users,
    users::model::User,
};
use chrono::{NaiveDateTime, Utc};
use diesel::{prelude::*, sql_query};

use diesel::query_dsl::RunQueryDsl;

use serde::{Deserialize, Serialize};

use uuid::Uuid;

pub enum LessonType {
    OneOnOne,
    OnlineBegginers,
}

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
    pub lesson_type: Option<String>,
    pub is_confirmed: bool,
    pub booked_at: chrono::NaiveDateTime,
    pub booked_by: Option<i32>,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Queryable, Deserialize, Serialize, Associations)]
#[belongs_to(Booking, foreign_key = "booking_id")]
#[table_name = "orders"]
pub struct Order {
    pub id: Uuid,
    pub email: String,
    pub booking_id: Uuid,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct CreateBookingInput {
    pub date: chrono::DateTime<chrono::Utc>,
    pub lesson_type: String,
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

    pub fn get_all_available_of_type(lesson: &str) -> Result<Vec<Booking>, CustomError> {
        let conn = connection()?;

        Ok(bookings::table
            .filter(bookings::booked_by.is_null())
            .filter(bookings::lesson_type.eq(lesson))
            .filter(bookings::booked_at.ge(Utc::now().naive_utc()))
            .order(bookings::booked_at)
            .load::<Booking>(&conn)?)
    }

    pub fn book(booking_id: Uuid, client_id: i32) -> Result<bool, CustomError> {
        let conn = connection()?;

        let booking: Booking = bookings::table.find(booking_id).first(&conn)?;

        if !booking.booked_by.is_none() {
            return Err(CustomError::new(400, "This booking is already taken."));
        } else if booking.lesson_type.is_some() {
            return Err(CustomError::new(
                400,
                "This booking's lesson type is already set.",
            ));
        }

        diesel::update(&booking)
            .set((bookings::booked_by.eq(Some(client_id)),))
            .execute(&conn)?;

        Ok(true)
    }

    pub fn create(
        date: chrono::DateTime<Utc>,
        user_id: i32,
        lesson_type: &str,
    ) -> Result<Booking, CustomError> {
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
            lesson_type: Some(lesson_type.to_owned()),
            is_confirmed: false,
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

    pub fn get_lesson_type(booking_id: Uuid) -> Result<Option<String>, CustomError> {
        let conn = connection()?;

        Ok(bookings::table
            .select(bookings::lesson_type)
            .find(booking_id)
            .first::<Option<String>>(&conn)?)
    }
}

impl Order {
    pub fn create(user_id: i32, booking_id: Uuid) -> Result<Order, CustomError> {
        let email = User::get_email(user_id)?;

        let order = Order {
            id: Uuid::new_v4(),
            email: email,
            booking_id: booking_id,
            created_at: Utc::now().naive_utc(),
        };

        Ok(order)
    }
}

impl LessonType {
    pub fn from_str(input: &str) -> Result<LessonType, CustomError> {
        match input {
            "One_On_One" => Ok(LessonType::OneOnOne),
            "Online_Begginers" => Ok(LessonType::OnlineBegginers),
            _ => Err(CustomError::new(400, "Invalid lesson type input.")),
        }
    }

    pub fn get_lesson_price(&self) -> String {
        match self {
            LessonType::OneOnOne => "45.00".to_owned(),
            LessonType::OnlineBegginers => "15.00".to_owned(),
        }
    }

    pub fn get_description(&self) -> String {
        match self {
            LessonType::OneOnOne => "Mballet one on one lesson.".to_owned(),
            LessonType::OnlineBegginers => {
                "Mballet online lesson dedicated for begginers.".to_owned()
            }
        }
    }
}
