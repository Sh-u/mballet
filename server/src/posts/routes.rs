use crate::error_handler::CustomError;
use crate::posts::model::{NewPost, Post, PostsRequestBody};
use actix_web::{delete, get, post, put, web, HttpResponse};
use serde_json::json;

#[post("/posts")]
async fn create(req_body: web::Json<PostsRequestBody>) -> Result<HttpResponse, CustomError> {
    let post = Post::create(req_body.into_inner())?;

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
