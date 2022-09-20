use actix_session::{SessionGetError, SessionInsertError};
use actix_web::{http::StatusCode, HttpResponse, ResponseError as ActixError};
use diesel::result::Error as DieselError;
use reqwest::Error as ReqwestError;
use serde::Deserialize;
use serde_json::json;
use std::{borrow::Cow, fmt::Display};
use validator::ValidationError;
#[derive(Debug, Deserialize)]
pub struct CustomError {
    message: String,
    status_code: u16,
}

impl CustomError {
    pub fn new(status_code: u16, message: &str) -> Self {
        println!("creating an error: {status_code}, {message}");
        CustomError {
            message: message.to_owned(),
            status_code,
        }
    }
}

impl Display for CustomError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(self.message.as_str())
    }
}

impl From<DieselError> for CustomError {
    fn from(error: DieselError) -> CustomError {
        match error {
            DieselError::DatabaseError(_, err) => CustomError::new(409, err.message()),

            DieselError::NotFound => CustomError::new(404, "Database not found"),
            err => CustomError::new(500, format!("Unknown diesel error: {}", err).as_str()),
        }
    }
}

impl From<ValidationError> for CustomError {
    fn from(error: ValidationError) -> Self {
        println!("creating ValidationError");
        let code: u16 = match error.code {
            Cow::Borrowed(v) => v.parse().unwrap(),
            Cow::Owned(v) => v.parse().unwrap(),
        };

        let message = match error.message {
            Some(Cow::Borrowed(v)) => v.to_owned(),
            Some(Cow::Owned(v)) => v,
            _ => format!("Unknown Validation Error!"),
        };

        CustomError::new(code, message.as_str())
    }
}
impl From<SessionInsertError> for CustomError {
    fn from(error: SessionInsertError) -> Self {
        CustomError::new(401, format!("Session insert error: {}", error).as_str())
    }
}

impl From<ReqwestError> for CustomError {
    fn from(error: ReqwestError) -> Self {
        CustomError::new(400, format!("Session insert error: {}", error).as_str())
    }
}

impl From<SessionGetError> for CustomError {
    fn from(error: SessionGetError) -> Self {
        CustomError::new(401, format!("Session get error: {}", error).as_str())
    }
}

impl ActixError for CustomError {
    fn error_response(&self) -> HttpResponse {
        let status_code = match StatusCode::from_u16(self.status_code) {
            Ok(code) => code,
            Err(_) => StatusCode::INTERNAL_SERVER_ERROR,
        };

        let msg = match status_code.as_u16() < 500 {
            true => self.message.to_owned(),
            false => "Internal server error".to_string(),
        };

        HttpResponse::build(status_code).json(json!({ "message": msg }))
    }
}
