use super::model::{Credentials, UsersApiBody};
use crate::{
    db::connection,
    error_handler::CustomError,
    schema::users,
    users::{
        auth_utils::{get_current_user, is_signed_in, set_current_user},
        model::{
            Confirmation, GoogleParams, GoogleRedirectCode, GoogleTokenResponse,
            GoogleUserInfoResponse, MailInfo, ResetPassword, User,
        },
        register_handler::{create_confirmation, RegisterData},
    },
};
use actix_session::Session;
use actix_web::{delete, get, post, put, web, HttpResponse};
use diesel::prelude::*;
use diesel::{query_dsl::QueryDsl, RunQueryDsl};
use reqwest::header::AUTHORIZATION;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::{collections::HashMap, str::FromStr};
#[post("users")]
async fn create(input: web::Json<UsersApiBody>) -> Result<HttpResponse, CustomError> {
    let user = User::create(input.into_inner())?;

    Ok(HttpResponse::Ok().json(user))
}

#[put("users/{id}")]
async fn update(
    id: web::Path<i32>,
    input: web::Json<UsersApiBody>,
) -> Result<HttpResponse, CustomError> {
    let user = User::update(id.into_inner(), input.into_inner())?;

    Ok(HttpResponse::Ok().json(user))
}

#[delete("users/{id}")]
async fn delete(id: web::Path<i32>) -> Result<HttpResponse, CustomError> {
    User::delete_one(id.into_inner())?;

    Ok(HttpResponse::Ok().json(json!({
        "message": "User successfully deleted!"
    })))
}

#[get("users")]
async fn get_all() -> Result<HttpResponse, CustomError> {
    let users = web::block(|| User::get_all())
        .await
        .expect("error getting all users")
        .expect("error getting all users 2");

    Ok(HttpResponse::Ok().json(users))
}

#[get("/register/{uuid}")]
pub async fn get_confirmation(uuid: web::Path<String>) -> Result<HttpResponse, CustomError> {
    println!("uuid");
    let uuid = uuid::Uuid::from_str(uuid.into_inner().as_str()).unwrap();
    println!("uuid: {}", uuid);
    let confirmation = Confirmation::get(uuid)?;

    Ok(HttpResponse::Ok().json(confirmation))
}

#[post("/register")]
pub async fn send_confirmation(
    session: Session,
    data: web::Json<RegisterData>,
) -> Result<HttpResponse, CustomError> {
    if is_signed_in(&session) {
        return Err(CustomError::new(400, "already signed in!"));
    }
    let email = data.into_inner().email;

    let info = MailInfo {
        message: "Click on the link to verify your account.",
        path: "register",
        title: "Mballet account verification",
    };

    let result = create_confirmation(email, info);

    match result {
        Ok(_) => Ok(HttpResponse::Ok().finish()),
        Err(err) => Err(err),
    }
}

#[post("/register/{path_id}")]
pub async fn confirm_creation(
    session: Session,
    path_id: web::Path<String>,
) -> Result<HttpResponse, CustomError> {
    if is_signed_in(&session) {
        return Err(CustomError::new(
            400,
            "Creating user failed. The user is already signed in.",
        ));
    }

    let session_user = User::confirm_creation(path_id.as_str())?;

    let result = session.insert("user", &session_user);

    match result {
        Ok(_) => Ok(HttpResponse::Ok().json(session_user)),
        Err(err) => Err(CustomError::new(
            500,
            format!("Error while creting a session user: {}", err).as_str(),
        )),
    }
}

#[post("/login")]
pub async fn login(
    session: Session,
    credentials: web::Json<Credentials>,
) -> Result<HttpResponse, CustomError> {
    if is_signed_in(&session) {
        return Err(CustomError::new(
            400,
            "Creating user failed. The user is already signed in.",
        ));
    }

    User::login(session, credentials.into_inner())?;

    Ok(HttpResponse::Ok().finish())
}

#[derive(Serialize, Deserialize)]
pub struct ResetInput {
    email: String,
}

#[post("/reset")]
pub async fn reset(input: web::Json<ResetInput>) -> Result<HttpResponse, CustomError> {
    let email = input.into_inner().email;
    User::reset(&email)?;

    let info = MailInfo {
        message: "Click on the link to reset your password.",
        path: "forgotpassword",
        title: "Mballet password reset",
    };

    create_confirmation(email, info)?;

    Ok(HttpResponse::Ok().finish())
}

#[post("/reset/{path_id}")]
pub async fn confirm_reset(
    path_id: web::Path<String>,
    input: web::Json<ResetPassword>,
) -> Result<HttpResponse, CustomError> {
    User::confirm_reset(path_id.as_str(), input.into_inner().password.as_str())?;

    Ok(HttpResponse::Ok()
        // .append_header(("Access-Control-Allow-Origin", "http://localhost:3000"))
        .finish())
}

#[get("/me")]
pub async fn me(session: Session) -> Result<HttpResponse, CustomError> {
    println!("me session: {:#?}", session.entries());
    let session_user_id = get_current_user(&session)?;

    let user = User::get_one(session_user_id)?;

    Ok(HttpResponse::Ok().json(user))
}

#[post("/logout")]
pub async fn logout(session: Session) -> Result<HttpResponse, CustomError> {
    if !is_signed_in(&session) {
        return Err(CustomError::new(400, "There is no one signed in"));
    }

    session.purge();

    Ok(HttpResponse::Ok().finish())
}

#[get("/authenticate/google_init")]
pub async fn google_init() -> Result<HttpResponse, CustomError> {
    let params = GoogleParams {
        client_id: std::env::var("GOOGLE_CLIENT_ID").expect("set the google client id env"),
        redirect_uri: "http://127.0.0.1:7878/authenticate/google".to_owned(),
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile".to_owned(),
        response_type: "code".to_owned(),
        access_type: "offline".to_owned(),
        prompt: "consent".to_owned()
    };

    let google_login_url = format!(
        "https://accounts.google.com/o/oauth2/v2/auth?{}",
        serde_qs::to_string(&params).unwrap()
    );

    Ok(HttpResponse::Ok().json(json!({ "url": google_login_url })))
}

#[get("/authenticate/google")]
pub async fn google_auth(
    session: Session,
    info: web::Query<GoogleRedirectCode>,
) -> Result<HttpResponse, CustomError> {
    println!("Authorization request for code");

    let mut params = HashMap::new();
    params.insert(
        "client_id",
        std::env::var("GOOGLE_CLIENT_ID").expect("set the google client env"),
    );
    params.insert(
        "client_secret",
        std::env::var("GOOGLE_CLIENT_SECRET").expect("set the google client secret env"),
    );
    params.insert(
        "redirect_uri",
        "http://127.0.0.1:7878/authenticate/google".to_owned(),
    );
    params.insert("grant_type", "authorization_code".to_owned());
    params.insert("code", info.into_inner().code);

    println!("params: {:#?}", params);

    let client = reqwest::Client::new();
    let res = client
        .post("https://oauth2.googleapis.com/token")
        .form(&params)
        .send()
        .await;

    if let Err(err) = res {
        return Err(CustomError::new(
            400,
            format!("error while getting the google token response, {}", err).as_str(),
        ));
    }
    let tokens = res.unwrap().text().await;

    if let Err(err) = tokens {
        return Err(CustomError::new(
            400,
            format!("failed to json google token response, {}", err).as_str(),
        ));
    }
    let tokens = tokens.unwrap();
    println!("text: {}", tokens.clone());

    let tokens_json: Result<GoogleTokenResponse, _> = serde_json::from_str(&tokens);

    if let Err(err) = tokens_json {
        return Err(CustomError::new(
            400,
            format!("failed to json google token from str, {}", err).as_str(),
        ));
    }

    let auth = client
        .get("https://www.googleapis.com/oauth2/v2/userinfo")
        .header(
            AUTHORIZATION,
            format!("Bearer {}", tokens_json.unwrap().access_token),
        )
        .send()
        .await
        .expect("failed to get google auth with this token");

    let auth_response = auth
        .json::<GoogleUserInfoResponse>()
        .await
        .expect("Failed to json userInfo response");

    println!("userInfo email: {}", auth_response.email.clone());

    let conn = connection()?;
    let user_in_db = users::table
        .filter(users::email.eq(auth_response.email.clone()))
        .get_result::<User>(&conn);

    let input = UsersApiBody {
        email: auth_response.email,
        password: "randompass".to_owned(),
        username: auth_response.id,
        auth_type: "GOOGLE".to_owned(),
    };

    if user_in_db.is_err() {
        let user = User::create(input)?;
        set_current_user(&session, user.id);
    } else {
        set_current_user(&session, user_in_db.unwrap().id);
    }

    Ok(HttpResponse::TemporaryRedirect()
        .append_header(("Location", "http://localhost:3000"))
        .finish())
}

pub fn init_routes(config: &mut web::ServiceConfig) {
    config.service(get_all);
    config.service(create);
    config.service(update);
    config.service(delete);
    config.service(me);
    config.service(login);
    config.service(logout);
    config.service(get_confirmation);
    config.service(send_confirmation);
    config.service(confirm_creation);
    config.service(reset);
    config.service(confirm_reset);
    config.service(google_init);
    config.service(google_auth);
}
