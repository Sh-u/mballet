use super::model::{BalletClass, ClassName, ClassType, CourseName};
use crate::{
    bookings::model::Booking,
    db::connection,
    error_handler::CustomError,
    schema::{ballet_classes, bookings, users},
    users::model::User,
};
use chrono::Utc;
use diesel::{dsl::count, prelude::*, sql_query, BelongingToDsl};
use uuid::Uuid;

impl ClassType {
    pub fn from_class_name(class_name: &ClassName) -> Self {
        match class_name {
            ClassName::One_On_One => ClassType::SINGLE,
            ClassName::Beginners_Online => ClassType::GROUP,
            ClassName::Intermediate_Online => ClassType::GROUP,
            ClassName::Course_Beginners_Level_One => ClassType::GROUP,
            ClassName::Course_Intermediate_Level_One => ClassType::GROUP,
            ClassName::Course_Beginners_Level_One_Seniors => ClassType::GROUP,
        }
    }
}

impl ClassName {
    pub fn from_str(input: &str) -> Result<ClassName, CustomError> {
        match input {
            "One_On_One" => Ok(ClassName::One_On_One),
            "Beginners_Online" => Ok(ClassName::Beginners_Online),
            "Intermediate_Online" => Ok(ClassName::Intermediate_Online),
            "Course_Beginners_Level_One" => Ok(ClassName::Course_Beginners_Level_One),
            "Course_Intermediate_Level_One" => Ok(ClassName::Course_Intermediate_Level_One),
            "Course_Beginners_Level_One_Seniors" => {
                Ok(ClassName::Course_Beginners_Level_One_Seniors)
            }
            _ => Err(CustomError::new(400, "Invalid lesson type input.")),
        }
    }

    pub fn get_lesson_price(&self) -> String {
        match self {
            ClassName::One_On_One => "45.00".to_owned(),
            ClassName::Beginners_Online => "15.00".to_owned(),
            ClassName::Intermediate_Online => "20.00".to_owned(),
            ClassName::Course_Beginners_Level_One => "12.00".to_owned(),
            ClassName::Course_Intermediate_Level_One => "15.00".to_owned(),
            ClassName::Course_Beginners_Level_One_Seniors => "12.00".to_owned(),
        }
    }

    pub fn get_name(&self) -> String {
        match self {
            ClassName::One_On_One => "One_On_One".to_owned(),
            ClassName::Beginners_Online => "Beginners_Online".to_owned(),
            ClassName::Intermediate_Online => "Intermediate_Online".to_owned(),
            ClassName::Course_Beginners_Level_One => "Course_Beginners_Level_One".to_owned(),
            ClassName::Course_Intermediate_Level_One => "Course_Intermediate_Level_One".to_owned(),
            ClassName::Course_Beginners_Level_One_Seniors => {
                "Course_Beginners_level_One_Seniors".to_owned()
            }
        }
    }

    pub fn get_description(&self) -> String {
        match self {
            ClassName::One_On_One => "Mballet one on one lesson.".to_owned(),
            ClassName::Beginners_Online => {
                "Mballet online lesson dedicated for begginers.".to_owned()
            }
            ClassName::Intermediate_Online => {
                "Mballet online lesson dedicated for intermediate students.".to_owned()
            }
            ClassName::Course_Beginners_Level_One => {
                "Mballet course lesson for beginners (level one)".to_owned()
            }
            ClassName::Course_Intermediate_Level_One => {
                "Mballet course lesson for intermediate (level one)".to_owned()
            }
            ClassName::Course_Beginners_Level_One_Seniors => {
                "Mballet course lesson for beginners (seniors)".to_owned()
            }
        }
    }
}

impl BalletClass {
    pub fn create(
        date: chrono::DateTime<Utc>,
        user_id: i32,
        class_name: &str,
    ) -> Result<BalletClass, CustomError> {
        let conn = connection()?;
        let caller = users::table.find(user_id).get_result::<User>(&conn)?;

        if !caller.is_admin {
            return Err(CustomError::new(
                400,
                "This action requires admin privileges.",
            ));
        }

        let class_name = ClassName::from_str(&class_name)?;

        let class_type = ClassType::from_class_name(&class_name);
        dbg!(&class_name);

        let class = BalletClass {
            id: Uuid::new_v4(),
            class_type: class_type,
            class_name: class_name,
            class_date: date.naive_utc(),
            slots: Some(5),
            created_at: Utc::now().naive_utc(),
        };

        if class.class_date <= Utc::now().naive_utc() {
            return Err(CustomError::new(400, "Please enter a valid date."));
        }

        let same_time = sql_query(
            format!(
                "SELECT id from ballet_classes where date_trunc('minutes', class_date) = '{}'",
                class.class_date.format("%Y-%m-%d %H:%M:00")
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

        let class = diesel::insert_into(ballet_classes::table)
            .values(class)
            .get_result(&conn)?;

        Ok(class)
    }

    pub fn get_all_booked_by_user(user_id: i32) -> Result<Vec<BalletClass>, CustomError> {
        // let bookings = Booking::get_all_by_user_id(user_id)?;

        let conn = connection()?;

        let classes = ballet_classes::table
            .left_join(bookings::table.on(bookings::ballet_class.eq(ballet_classes::id)))
            .select(ballet_classes::all_columns)
            .filter(bookings::booked_by.eq(user_id))
            .order(ballet_classes::class_date)
            .load::<BalletClass>(&conn)?;
        Ok(classes)
    }

    pub fn get_one(class_id: Uuid) -> Result<BalletClass, CustomError> {
        let conn = connection()?;

        let class = ballet_classes::table.find(class_id).get_result(&conn)?;

        Ok(class)
    }

    pub fn get_class_type_as_string(booking_id: Uuid) -> Result<String, CustomError> {
        let conn = connection()?;

        Ok(ballet_classes::table
            .select(ballet_classes::class_type)
            .find(booking_id)
            .first::<String>(&conn)?)
    }

    pub fn get_all() -> Result<Vec<BalletClass>, CustomError> {
        let conn = connection()?;

        Ok(ballet_classes::table.load::<BalletClass>(&conn)?)
    }
    pub fn get_all_available_by_name(
        class_name_str: &str,
    ) -> Result<Vec<BalletClass>, CustomError> {
        let conn = connection()?;

        let class_name = ClassName::from_str(class_name_str)?;

        match class_name {
            ClassName::Beginners_Online => Ok(sql_query(
                "select ballet_classes.* 
                from ballet_classes 
                left join bookings on ballet_classes.id=bookings.ballet_class 
                GROUP BY ballet_classes.id having COUNT(bookings.id) < ballet_classes.slots 
                AND ballet_classes.class_name='beginners_online'
                AND ballet_classes.class_date >= now() 
                order by ballet_classes.class_date",
            )
            .load::<BalletClass>(&conn)?),
            ClassName::One_On_One => Ok(sql_query(
                "select ballet_classes.*
            from ballet_classes
            left join bookings on ballet_classes.id=bookings.ballet_class
            where bookings.booked_by is null
            AND ballet_classes.class_name='one_on_one'",
            )
            .load::<BalletClass>(&conn)?),
            ClassName::Intermediate_Online => {
                // let classes = ballet_classes::table.load::<BalletClass>(&conn)?;

                let classes: Vec<BalletClass> = ballet_classes::table
                    .left_join(bookings::table.on(bookings::id.eq(ballet_classes::id)))
                    .select(ballet_classes::all_columns)
                    .filter(ballet_classes::class_name.eq(class_name))
                    .order(ballet_classes::class_date)
                    .get_results(&conn)?;

                let mut id_to_filter = Vec::new();

                for class in classes.iter() {
                    let bookings: Vec<Booking> = Booking::belonging_to(class).load(&conn)?;

                    if bookings.len() >= class.slots.unwrap() as usize {
                        id_to_filter.push(class.id);
                    }
                }

                Ok(classes
                    .into_iter()
                    .filter(|class| !id_to_filter.iter().any(|id| id == &class.id))
                    .collect::<Vec<BalletClass>>())
            }
            ClassName::Course_Beginners_Level_One => {
                // let classes = ballet_classes::table.load::<BalletClass>(&conn)?;

                // let classes: Vec<BalletClass> = ballet_classes::table
                //     .left_join(bookings::table)
                //     .select(ballet_classes::all_columns)
                //     .filter(ballet_classes::class_name.eq(class_name))
                //     .order(ballet_classes::class_date)
                //     .get_results(&conn)?;

                // let bookings: Vec<Vec<Booking>> = Booking::belonging_to(&classes)
                //     .load::<Booking>(&conn)?
                //     .grouped_by(&classes);

                // let classes = classes
                // .into_iter()
                // .filter(|&(i, class)| bookings.get(0)
                // .and_then(|bs| if let Some(b) = bs.get(i) {
                //     return b.len() as i32 < class.slots as i32;
                // }))

                return Ok(sql_query(
                    "select ballet_classes.* 
                    from ballet_classes 
                    left join bookings on ballet_classes.id=bookings.ballet_class 
                    GROUP BY ballet_classes.id having COUNT(bookings.id) < ballet_classes.slots 
                    AND ballet_classes.class_name='course_beginners_level_one'
                    AND ballet_classes.class_date >= now() 
                    order by ballet_classes.class_date",
                )
                .load::<BalletClass>(&conn)?);
            }
            ClassName::Course_Intermediate_Level_One => {
                return Ok(sql_query(
                    "select ballet_classes.* 
                    from ballet_classes 
                    left join bookings on ballet_classes.id=bookings.ballet_class 
                    GROUP BY ballet_classes.id having COUNT(bookings.id) < ballet_classes.slots 
                    AND ballet_classes.class_name='course_intermediate_level_one'
                    AND ballet_classes.class_date >= now() 
                    order by ballet_classes.class_date",
                )
                .load::<BalletClass>(&conn)?);
            }
            ClassName::Course_Beginners_Level_One_Seniors => {
                return Ok(sql_query(
                    "select ballet_classes.* 
                    from ballet_classes 
                    left join bookings on ballet_classes.id=bookings.ballet_class 
                    GROUP BY ballet_classes.id having COUNT(bookings.id) < ballet_classes.slots 
                    AND ballet_classes.class_name='course_beginners_level_one_seniors'
                    AND ballet_classes.class_date >= now() 
                    order by ballet_classes.class_date",
                )
                .load::<BalletClass>(&conn)?);
            }
            _ => Err(CustomError::new(
                400,
                "This lesson is not available for purchase.",
            )),
        }

        // Ok(ballet_classes::table
        //     .filter(ballet_classes::slots.is_null())
        //     .filter(bookings::lesson_type.eq(class_type))
        //     .filter(bookings::booked_at.ge(Utc::now().naive_utc()))
        //     .order(bookings::booked_at)
        //     .load::<Booking>(&conn)?)
    }

    pub fn check_available(class_ids: Vec<Uuid>) -> Result<Option<Vec<BalletClass>>, CustomError> {
        let mut classes = Vec::with_capacity(class_ids.len());

        for id in class_ids {
            let class = BalletClass::get_one(id)?;
            classes.push(class);
        }

        let conn = connection()?;

        let first_name = classes.get(0).unwrap().class_name.get_name();

        for class in &classes {
            let class_bookings: Vec<Booking> =
                Booking::belonging_to(class).load::<Booking>(&conn)?;

            if class.class_name.get_name() != first_name {
                return Err(CustomError::new(
                    400,
                    "Unable to create an order with multiple different class types.",
                ));
            }

            match class.class_type {
                ClassType::SINGLE if class_bookings.is_empty() => continue,
                ClassType::GROUP if class_bookings.len() < class.slots.unwrap() as usize => {
                    continue
                }
                _ => return Ok(None),
            }
        }

        Ok(Some(classes))
    }
}

impl CourseName {
    pub fn from_str(course_name: &str) -> Result<Self, CustomError> {
        match course_name {
            "Course_Beginners_Level_One" => Ok(CourseName::CourseBeginnersLevelOne),
            "Course_Beginners_Level_One_Seniors" => Ok(CourseName::CourseBeginnersLevelOneSeniors),
            _ => Err(CustomError::new(400, "Invalid course name")),
        }
    }

    pub fn from_class_name(class_name: &ClassName) -> Result<Self, CustomError> {
        match class_name {
            ClassName::Course_Beginners_Level_One => Ok(CourseName::CourseBeginnersLevelOne),
            ClassName::Course_Beginners_Level_One_Seniors => {
                Ok(CourseName::CourseBeginnersLevelOneSeniors)
            }
            _ => Err(CustomError::new(400, "Invalid course name")),
        }
    }

    pub fn get_price(&self) -> String {
        match self {
            CourseName::CourseBeginnersLevelOne => "85.00".to_owned(),
            CourseName::CourseIntermediateLevelOne => "105.00".to_owned(),
            CourseName::CourseBeginnersLevelOneSeniors => "85.00".to_owned(),
        }
    }

    pub fn get_classes_quantity(&self) -> String {
        match self {
            CourseName::CourseBeginnersLevelOne => "8".to_owned(),
            CourseName::CourseIntermediateLevelOne => "8".to_owned(),
            CourseName::CourseBeginnersLevelOneSeniors => "8".to_owned(),
        }
    }
}
