use chrono::prelude::Utc;

use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use super::super::schema::posts;
use crate::db::connection;
use crate::error_handler::CustomError;

#[derive(Queryable, Serialize, Deserialize, Insertable)]
#[table_name = "posts"]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub published: bool,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Serialize, Deserialize)]
pub struct PostsRequestBody {
    pub title: String,
    pub body: String,
    pub published: bool,
}

impl PostsRequestBody {
    pub fn from(post: PostsRequestBody) -> Self {
        PostsRequestBody {
            title: post.title,
            body: post.body,
            published: post.published,
        }
    }
}

#[derive(Serialize, Deserialize, AsChangeset, Insertable)]
#[table_name = "posts"]
pub struct NewPost {
    pub title: String,
    pub body: String,
    pub published: bool,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

impl NewPost {
    pub fn from(new_post: NewPost) -> NewPost {
        NewPost {
            title: new_post.title,
            body: new_post.body,
            published: new_post.published,
            created_at: Utc::now().naive_utc(),
            updated_at: Some(Utc::now().naive_utc()),
        }
    }
}

impl Post {
    pub fn create(req_body: PostsRequestBody) -> Result<Self, CustomError> {
        let post = NewPost {
            title: req_body.title,
            body: req_body.body,
            published: req_body.published,
            created_at: Utc::now().naive_utc(),
            updated_at: Some(Utc::now().naive_utc()),
        };

        if post.title.len() < 3 || post.body.len() < 5 {
            return Err(CustomError::new(400, "Your input is too short!"));
        }

        let conn = connection()?;

        let post = diesel::insert_into(posts::table)
            .values(post)
            .get_result(&conn)?;

        Ok(post)
    }

    pub fn get_all() -> Result<Vec<Self>, CustomError> {
        let conn = connection()?;
        let posts = posts::table.load::<Post>(&conn)?;

        Ok(posts)
    }

    pub fn get_one(id: i32) -> Result<Self, CustomError> {
        let conn = connection()?;

        let old_post = posts::table.filter(posts::id.eq(id)).first(&conn)?;

        Ok(old_post)
    }
    pub fn update(id: i32, req_body: PostsRequestBody) -> Result<Self, CustomError> {
        let conn = connection()?;
        let old_post = posts::table.filter(posts::id.eq(id)).first::<Post>(&conn)?;

        let t = match req_body.title.len() {
            1.. => req_body.title,
            _ => old_post.title,
        };

        let b = match req_body.body.len() {
            1.. => req_body.body,
            _ => old_post.body,
        };

        let values = NewPost {
            title: t,
            body: b,
            published: req_body.published,
            created_at: old_post.created_at,
            updated_at: Some(Utc::now().naive_utc()),
        };

        let updated = diesel::update(posts::table.find(id))
            .set(values)
            .get_result(&conn)
            .expect("failed to find post");

        Ok(updated)
    }

    pub fn delete(id: i32) -> Result<usize, CustomError> {
        let conn = connection()?;

        let res = diesel::delete(posts::table.filter(posts::id.eq(id))).execute(&conn)?;

        Ok(res)
    }
}
