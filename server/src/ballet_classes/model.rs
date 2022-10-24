use crate::{error_handler::CustomError, schema::ballet_classes};
use diesel::sql_types::Text;
use diesel_enum::DbEnum;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
#[derive(Debug, Serialize, Deserialize, Eq, PartialEq)]
pub enum CourseName {
    CourseBeginnersLevelOne,
    CourseBeginnersLevelOneSeniors,
}

#[derive(Debug, AsExpression, FromSqlRow, DbEnum, Serialize, Deserialize, Eq, PartialEq)]
#[sql_type = "Text"]
#[error_fn = "CustomError::enum_error"]
#[error_type = "CustomError"]
pub enum ClassType {
    GROUP,
    SINGLE,
}

#[allow(non_camel_case_types)]
#[derive(Debug, AsExpression, FromSqlRow, DbEnum, Serialize, Deserialize, Eq, PartialEq)]
#[sql_type = "Text"]
#[error_fn = "CustomError::enum_error"]
#[error_type = "CustomError"]
pub enum ClassName {
    One_On_One,
    Beginners_Online,
    Course_Beginners_Level_One,
    Course_Beginners_Level_One_Seniors,
}
#[derive(
    Serialize, Deserialize, Queryable, Insertable, Identifiable, Associations, QueryableByName,
)]
#[table_name = "ballet_classes"]
pub struct BalletClass {
    pub id: Uuid,
    pub class_type: ClassType,
    pub class_name: ClassName,
    pub class_date: chrono::NaiveDateTime,
    pub slots: Option<i32>,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct CreateClassInput {
    pub date: chrono::DateTime<chrono::Utc>,
    pub class_name: String,
}
