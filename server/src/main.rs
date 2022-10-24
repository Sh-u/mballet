#[macro_use]
extern crate diesel;

use actix_cors::Cors;
use actix_session::config::SessionLifecycle;
use actix_session::config::{PersistentSession, TtlExtensionPolicy};
use actix_session::{storage::RedisActorSessionStore, SessionMiddleware};
use actix_web::cookie::time::Duration;
use actix_web::{cookie::SameSite, http, middleware::Logger, App, HttpServer};
use ballet_classes::routes::init_routes as ClassesInitRoutes;
use bookings::routes::init_routes as BookingsInitRoutes;
use dotenv::dotenv;
use futures::AsyncReadExt;
use listenfd::ListenFd;
use orders::routes::init_routes as OrdersInitRoutes;
use posts::routes::init_routes as PostsInitRoutes;
use std::env;
use users::routes::init_routes as UserInitRoutes;
pub mod ballet_classes;
pub mod bookings;
pub mod db;
pub mod error_handler;
pub mod orders;
pub mod posts;
pub mod schema;
pub mod users;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    db::init();
    const SECS_IN_WEEK: i64 = 60 * 60 * 24 * 7;
    std::env::set_var("RUST_LOG", "debug");
    std::env::set_var("RUST_BACKTRACE", "1");

    let mut listenfd = ListenFd::from_env();

    env_logger::init();

    let cookie_key = env::var("COOKIE_KEY").unwrap();

    let private_key = actix_web::cookie::Key::from(cookie_key.as_bytes());

    let mut server = HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![
                http::header::AUTHORIZATION,
                http::header::ACCEPT,
                http::header::ACCESS_CONTROL_ALLOW_CREDENTIALS,
                http::header::ACCESS_CONTROL_ALLOW_ORIGIN,
                http::header::ACCESS_CONTROL_ALLOW_HEADERS,
                http::header::CONTENT_TYPE,
            ])
            .supports_credentials()
            .max_age(3600);

        App::new()
            .wrap(
                SessionMiddleware::builder(
                    RedisActorSessionStore::new("127.0.0.1:6379"),
                    private_key.clone(),
                )
                .cookie_path("/".to_owned())
                .cookie_name("mballet".to_owned())
                .cookie_same_site(SameSite::None)
                .cookie_secure(true)
                .session_lifecycle(SessionLifecycle::PersistentSession(
                    PersistentSession::default().session_ttl(Duration::seconds(SECS_IN_WEEK)),
                ))
                .build(),
            )
            .wrap(cors)
            .wrap(Logger::default())
            .configure(PostsInitRoutes)
            .configure(UserInitRoutes)
            .configure(BookingsInitRoutes)
            .configure(OrdersInitRoutes)
            .configure(ClassesInitRoutes)
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
