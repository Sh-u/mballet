use uuid::Uuid;

#[derive(Queryable, Associations, Identifiable, Debug)]
#[belongs_to(User)]
pub struct Booking {
    id: Uuid,
    booked_at: chrono::NaiveDateTime,
    booked_by: i32,
    created_at: chrono::NaiveDateTime,
}

impl Booking {
    pub fn get_all_by_user_id(user_id: i32) -> Result<Booking, CustomError> {
        let conn = connection()?;
        let user = users::table.find(user_id).get_result::<User>(&conn)?;
    }
}
