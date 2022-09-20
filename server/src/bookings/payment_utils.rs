use crate::error_handler::CustomError;
use base64;
use reqwest;
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use serde::{Deserialize, Serialize};
use serde_json::{self, json};
use std::env;

use super::model::{LessonType, Order};

#[derive(Serialize, Deserialize)]
pub struct PaypalLinks {
    href: String,
    rel: String,
    method: String,
}

#[derive(Serialize, Deserialize)]
pub struct PaypalCreateOrderResponse {
    id: String,
    status: String,
    links: Vec<PaypalLinks>,
}

#[derive(Serialize, Deserialize)]
pub struct PaypalAccessTokenResponse {
    scope: String,
    access_token: String,
    token_type: String,
    app_id: String,
    expires_in: i32,
    nonce: String,
}
#[derive(Serialize, Deserialize)]

pub struct PaypalCapturePaymentResponse {
    id: String,
    status: String,
    links: Link,
}
#[derive(Serialize, Deserialize)]
pub struct Link {
    pub href: String,
    pub rel: String,
    pub method: String,
}
#[derive(Serialize, Deserialize)]
pub struct Payer {
    pub name: PayerName,
    pub email_address: String,
    pub payer_id: String,
}
#[derive(Serialize, Deserialize)]
pub struct PayerName {
    pub given_name: String,
    pub surname: String,
}

pub async fn generate_paypal_access_token() -> Result<String, CustomError> {
    let paypal_client_id = env::var("PAYPAL_CLIENT_ID").expect("set paypal client id in env");
    let paypal_client_secret = env::var("PAYPAL_CLIENT_SECRET").expect("set paypal secret in env");

    let buffer_str = format!("{}:{}", paypal_client_id, paypal_client_secret);

    let buffer = buffer_str.as_bytes();

    let auth = base64::encode(&buffer);

    let client = reqwest::Client::new();

    let response = client
        .post(format!(
            "{}/v1/oauth2/token",
            env::var("PAYPAL_BASE_URL").expect("set paypal base url in env")
        ))
        .body("grant_type=client_credentials")
        .header(AUTHORIZATION, format!("Bearer {}", auth))
        .send()
        .await?;

    let data: PaypalAccessTokenResponse = response.json().await?;

    Ok(data.access_token)
}

pub async fn create_order(
    lesson: LessonType,
    db_order: Order,
) -> Result<PaypalCreateOrderResponse, CustomError> {
    let access_token = generate_paypal_access_token().await?;

    let url = format!(
        "{}/v2/checkout/orders",
        env::var("PAYPAL_BASE_URL").expect("set the paypal base url var")
    );

    let client = reqwest::Client::new();
    let mut headers = HeaderMap::new();

    headers.insert(
        CONTENT_TYPE,
        HeaderValue::from_str("application/json").unwrap(),
    );
    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str(format!("Bearer {}", access_token).as_str()).unwrap(),
    );

    let price = lesson.get_lesson_price();
    let description = lesson.get_description();
    let response = client
        .post(url)
        .headers(headers)
        .body(
            json!({
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": "GBP",
                            "value": price
                        },
                        "description": description,
                        "reference_id": db_order.id
                    }
                ]
            })
            .to_string(),
        )
        .send()
        .await?;

    let data = response.json::<PaypalCreateOrderResponse>().await?;

    Ok(data)
}

pub async fn capture_payment(order_id: i32) -> Result<(PaypalCapturePaymentResponse), CustomError> {
    let access_token = generate_paypal_access_token().await?;
    let url = format!(
        "{}/v2/checkout/orders/{}/capture",
        env::var("PAYPAL_BASE_URL").expect("set the paypal base url var"),
        order_id
    );

    let client = reqwest::Client::new();
    let mut headers = HeaderMap::new();

    headers.insert(
        CONTENT_TYPE,
        HeaderValue::from_str("application/json").unwrap(),
    );
    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str(format!("Bearer {}", access_token).as_str()).unwrap(),
    );

    let response = client.post(&url).headers(headers).send().await?;

    let data = response.json::<PaypalCapturePaymentResponse>().await?;

    Ok(data)
}
