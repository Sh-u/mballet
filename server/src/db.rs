use diesel::pg::PgConnection;
use diesel::r2d2::ConnectionManager;
use dotenv::dotenv;
use lazy_static::lazy_static;
use r2d2;
use std::env;

use crate::error_handler::CustomError;

type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;
pub type DbConnection = r2d2::PooledConnection<ConnectionManager<PgConnection>>;

lazy_static! {
    static ref POOL: Pool = {
        dotenv().ok();
        let db_url = env::var("DATABASE_URL").expect("Database URL not set");

        let manager = ConnectionManager::<PgConnection>::new(db_url);
        Pool::new(manager).expect("failed to create new pool")
    };
}

pub fn connection() -> Result<DbConnection, CustomError> {
    POOL.get().map_err(|er| {
        CustomError::new(
            500,
            format!("Connection to database failed: {}", er).as_str(),
        )
    })
}

pub fn init() {
    lazy_static::initialize(&POOL);
    let _conn = connection().expect("failed to establish connection from the pool");
}
