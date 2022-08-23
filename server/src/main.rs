#[macro_use]
extern crate diesel;

use std::env;

use actix_cors::Cors;
use actix_web::{http, middleware::Logger, App, HttpServer};
use dotenv::dotenv;
use listenfd::ListenFd;
use posts::routes::{create, delete, get_all, update};

pub mod db;
pub mod error_handler;
pub mod posts;
pub mod schema;
pub mod users;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    db::init();

    std::env::set_var("RUST_LOG", "debug");
    std::env::set_var("RUST_BACKTRACE", "1");

    let mut listenfd = ListenFd::from_env();

    env_logger::init();

    let mut server = HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .service(create)
            .service(get_all)
            .service(update)
            .service(delete)
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
