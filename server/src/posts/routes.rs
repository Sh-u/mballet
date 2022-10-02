use std::fs::File;
use std::io::{Read, Write};

use crate::error_handler::CustomError;
use crate::posts::model::{Post, PostsRequestBody};

use actix_multipart::Multipart;

use actix_web::{delete, get, post, put, web, HttpResponse};
use futures_util::TryStreamExt as _;
use serde_json::json;
use uuid::Uuid;

#[post("/posts")]
async fn create(mut payload: Multipart) -> Result<HttpResponse, CustomError> {
    let mut post_input: Vec<web::Bytes> = Vec::new();

    let mut f: Option<Result<File, _>> = None;

    let mut file_path = None;

    while let Some(mut field) = payload.try_next().await.unwrap() {
        let content_disposition = field.content_disposition().to_owned();

        let field_name = content_disposition.get_name().to_owned();

        match field_name {
            Some("title") | Some("body") | Some("published") | Some("image") => (),
            _ => {
                return Err(CustomError::new(400, "Invalid request input."));
            }
        }

        println!("{:?}", field_name);

        if field_name == Some("image") {
            file_path = Some(format!(
                "/home/shu/Rust/mballet/web/public/post-{}.jpg",
                // current_dir.as_path().to_str().unwrap(),
                uuid::Uuid::new_v4()
            ));

            let fp = file_path.clone().unwrap();

            f = Some(web::block(move || File::create(fp)).await.unwrap());
        }

        while let Some(chunk) = field.try_next().await.unwrap() {
            if field_name != Some("image") {
                post_input.push(chunk);
            } else {
                f = web::block(move || {
                    f.as_ref()
                        .unwrap()
                        .as_ref()
                        .unwrap()
                        .write_all(&chunk)
                        .map(|_| f)
                })
                .await
                .unwrap()
                .unwrap();
            }
        }
    }
    println!("posts last: {:?}", post_input);

    let post = Post::create(
        std::str::from_utf8(post_input.get(0).unwrap())
            .unwrap()
            .to_owned(),
        std::str::from_utf8(post_input.get(1).unwrap())
            .unwrap()
            .to_owned(),
        post_input.get(2).is_some(),
        file_path,
    )?;

    Ok(HttpResponse::Ok().json(post))
}

#[get("/posts")]
async fn get_all() -> Result<HttpResponse, CustomError> {
    let posts = web::block(|| Post::get_all())
        .await
        .expect("failed to get all posts")
        .expect("failed to get all posts 2");

    Ok(HttpResponse::Ok().json(posts))
}

#[put("/posts/{id}")]
async fn update(
    id: web::Path<i32>,
    req_body: web::Json<PostsRequestBody>,
) -> Result<HttpResponse, CustomError> {
    let updated_post = Post::update(id.into_inner(), req_body.into_inner())?;

    Ok(HttpResponse::Ok().json(updated_post))
}

#[delete("/posts/{id}")]
async fn delete(id: web::Path<i32>) -> Result<HttpResponse, CustomError> {
    let res = Post::delete(id.into_inner())?;

    Ok(HttpResponse::Ok().json(json!({ "deleted": res })))
}

#[get("/posts/{id}")]
async fn get_one(id: web::Path<i32>) -> Result<HttpResponse, CustomError> {
    let post = Post::get_one(id.into_inner())?;

    Ok(HttpResponse::Ok().json(post))
}

pub fn init_routes(config: &mut web::ServiceConfig) {
    config.service(get_all);
    config.service(get_one);
    config.service(create);
    config.service(update);
    config.service(delete);
}
