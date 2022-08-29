#[macro_use]
extern crate diesel;

use std::env;

use actix_cors::Cors;
use actix_web::{dev::ServiceRequest, http, middleware::Logger, App, Error, HttpServer};
use actix_web_httpauth::{
    extractors::{
        bearer::{BearerAuth, Config},
        AuthenticationError,
    },
    middleware::HttpAuthentication,
};
use dotenv::dotenv;

use error_handler::CustomError;
use listenfd::ListenFd;
use posts::routes::init_routes as PostsInitRoutes;
use std::any::type_name;
use users::{register_handler::send_confirmation, routes::init_routes as UserInitRoutes};
mod auth;
pub mod db;
pub mod error_handler;
pub mod posts;
pub mod schema;
pub mod users;

async fn validator(
    req: ServiceRequest,
    credentials: BearerAuth,
) -> Result<ServiceRequest, (Error, ServiceRequest)> {
    let config = req.app_data::<Config>().cloned().unwrap_or_default();

    println!("config: {:#?}", config);

    if let Ok(res) = auth::validate_token(credentials.token()).await {
        if res == true {
            return Ok(req);
        } else {
            return Err((AuthenticationError::from(config).into(), req));
        }
    }

    Err((AuthenticationError::from(config).into(), req))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    db::init();

    std::env::set_var("RUST_LOG", "debug");
    std::env::set_var("RUST_BACKTRACE", "1");

    let mut listenfd = ListenFd::from_env();

    env_logger::init();

    let mut server = HttpServer::new(move || {
        // let auth = HttpAuthentication::bearer(validator);

        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            // .wrap(auth)
            .wrap(cors)
            .wrap(Logger::default())
            .configure(PostsInitRoutes)
            .configure(UserInitRoutes)
            .service(send_confirmation)
    });

    server = match listenfd.take_tcp_listener(0)? {
        Some(listener) => server.listen(listener)?,
        None => {
            let host = env::var("HOST").expect("Please set host in .env");
            let port = env::var("PORT").expect("Please set port in .env");
            server.bind(format!("{}:{}", host, port))?
        }
    };

    server.run().await
}
