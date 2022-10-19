use crate::{
    db::connection, error_handler::CustomError, schema::ballet_classes, schema::bookings,
    schema::orders, schema::users, users::model::User,
};
use chrono::{NaiveDateTime, Utc};
use diesel::{prelude::*, sql_query};

use diesel::query_dsl::RunQueryDsl;

use serde::{Deserialize, Serialize};

use uuid::Uuid;

pub enum LessonType {
    OneOnOne,
    BeginnersOnline,
}
#[derive(Serialize, Deserialize, Queryable, Insertable, Identifiable)]
#[table_name = "ballet_classes"]
pub struct BalletClass {
    pub id: Uuid,
    pub class_type: String,
    pub created_at: chrono::NaiveDateTime,
    pub class_date: chrono::NaiveDateTime,
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
#[belongs_to(BalletClass, foreign_key = "ballet_class")]
#[table_name = "bookings"]
pub struct Booking {
    pub id: Uuid,
    // pub lesson_type: Option<String>,
    // pub is_confirmed: bool,
    pub booked_at: chrono::NaiveDateTime,
    pub booked_by: Option<i32>,
    pub ballet_class: Option<Uuid>, // pub created_at: chrono::NaiveDateTime,
}

#[derive(Queryable, Deserialize, Serialize, Associations, Insertable)]
#[belongs_to(Booking, foreign_key = "booking_id")]
#[table_name = "orders"]
pub struct Order {
    pub id: String,
    pub completed: bool,
    pub transaction_id: Option<String>,
    pub booking_id: Option<Uuid>,
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
    // pub user_id: i32,
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
        }
        // else if booking.lesson_type.is_some() {
        //     return Err(CustomError::new(
        //         400,
        //         "This booking's lesson type is already set.",
        //     ));
        // }

        diesel::update(&booking)
            .set((
                bookings::booked_by.eq(Some(client_id)),
                bookings::is_confirmed.eq(true),
            ))
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

        LessonType::from_str(&lesson_type)?;

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

    pub fn get_lesson_type_string(booking_id: Uuid) -> Result<Option<String>, CustomError> {
        let conn = connection()?;

        Ok(bookings::table
            .select(bookings::lesson_type)
            .find(booking_id)
            .first::<Option<String>>(&conn)?)
    }

    pub fn get_one(booking_id: Uuid) -> Result<Booking, CustomError> {
        let conn = connection()?;

        let booking = bookings::table.find(booking_id).get_result(&conn)?;

        Ok(booking)
    }
}

impl BalletClass {}

impl Order {
    pub fn create(booking_id: Uuid, order_id: &str) -> Result<Order, CustomError> {
        Booking::get_one(booking_id)?;

        let conn = connection()?;

        let order = Order {
            id: order_id.to_owned(),
            completed: false,
            transaction_id: None,
            booking_id: Some(booking_id),
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

            let booking_id = order.booking_id.unwrap();

            Booking::book(booking_id, client_id)?;

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

impl LessonType {
    pub fn from_str(input: &str) -> Result<LessonType, CustomError> {
        match input {
            "One_On_One" => Ok(LessonType::OneOnOne),
            "Beginners_Online" => Ok(LessonType::BeginnersOnline),
            _ => Err(CustomError::new(400, "Invalid lesson type input.")),
        }
    }

    pub fn get_lesson_price(&self) -> String {
        match self {
            LessonType::OneOnOne => "45.00".to_owned(),
            LessonType::BeginnersOnline => "15.00".to_owned(),
        }
    }

    pub fn get_name(&self) -> String {
        match self {
            LessonType::OneOnOne => "One_On_One".to_owned(),
            LessonType::BeginnersOnline => "Beginners_Online".to_owned(),
        }
    }

    pub fn get_description(&self) -> String {
        match self {
            LessonType::OneOnOne => "Mballet one on one lesson.".to_owned(),
            LessonType::BeginnersOnline => {
                "Mballet online lesson dedicated for begginers.".to_owned()
            }
        }
    }
}
