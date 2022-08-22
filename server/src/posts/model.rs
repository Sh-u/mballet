use serde::{Deserialize, Serialize};

use diesel::prelude::*;

use super::super::schema::posts;
use crate::db::connection;
use crate::error_handler::CustomError;

#[derive(Queryable, Serialize, Deserialize, Insertable)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub published: bool,
}

#[derive(Serialize, Deserialize, AsChangeset, Insertable)]
#[table_name = "posts"]
pub struct NewPost {
    pub title: String,
    pub body: String,
    pub published: bool,
}

impl NewPost {
    pub fn from(new_post: NewPost) -> NewPost {
        NewPost {
            title: new_post.title,
            body: new_post.body,
            published: new_post.published,
        }
    }
}

impl Post {
    pub fn create(new_post: NewPost) -> Result<Self, CustomError> {
        let post = NewPost::from(new_post);

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
    pub fn update(id: i32, new_post: NewPost) -> Result<Self, CustomError> {
        let conn = connection()?;
        let old_post = posts::table.filter(posts::id.eq(id)).first::<Post>(&conn)?;

        let t = match new_post.title.len() {
            1.. => new_post.title,
            _ => old_post.title,
        };

        let b = match new_post.body.len() {
            1.. => new_post.body,
            _ => old_post.body,
        };

        let values = NewPost {
            title: t,
            body: b,
            published: new_post.published,
        };

        let updated = diesel::update(posts::table.find(id))
            .set(values)
            .get_result(&conn)
            .expect("failed to find post");

        Ok(updated)
    }

    pub fn delete(id: i32) -> Result<usize, CustomError> {
        let conn = connection()?;

        let found_post = posts::table
            .select(posts::id)
            .find(id)
            .first::<i32>(&conn)?;

        let res = diesel::delete(posts::table.filter(posts::id.eq(id))).execute(&conn)?;

        Ok(res)
    }
}

// pub fn create<'a>(conn: &PgConnection, _title: &'a str, _body: &'a str) -> Post {
//     let new_post = NewPost {
//         body: _body,
//         title: _title,
//         published: false,
//     };

//     diesel::insert_into(posts::table)
//         .values(&new_post)
//         .get_result(conn)
//         .expect("error saving new post")
// }

// pub fn show_posts(conn: &PgConnection) {
//     let results = table
//         .filter(published.eq(true))
//         .limit(5)
//         .load::<Post>(conn)
//         .expect("Error loading posts");

//     println!("Displaying {} posts", results.len());
//     for post in results {
//         println!("{}", post.title);
//         println!(" | ");
//         println!("{}", post.body);
//         println!("----------\n");
//     }
// }
