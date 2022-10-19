use crate::error_handler::CustomError;
use base64;
use reqwest;
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use serde::{Deserialize, Serialize};
use serde_json::{self, json};
use std::env;

use super::model::{LessonType, Order};

#[derive(Serialize, Deserialize)]
pub struct PaypalCreateOrderResponse {
    pub id: String,
    status: String,
    // purchase_units: Vec<PurchaseUnit>,
    links: Vec<PaypalLink>,
    create_time: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct PaypalLink {
    href: String,
    rel: String,
    method: String,
}

#[derive(Serialize, Deserialize)]
pub struct PurchaseUnit {
    pub reference_id: String,
    pub payments: Payments,
}

#[derive(Serialize, Deserialize)]
pub struct Payments {
    // authorizations: Vec<Authorization>,
    pub captures: Vec<Capture>,
}

#[derive(Serialize, Deserialize)]
pub struct Authorization {
    id: String,
    status: String,
    amount: Amount,
}

#[derive(Serialize, Deserialize)]
pub struct Amount {
    currency_code: String,
    value: String,
}

#[derive(Serialize, Deserialize)]
pub struct Capture {
    pub id: String,
    pub status: String,
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
    pub id: String,
    pub status: String,
    pub purchase_units: Vec<PurchaseUnit>,
    links: Vec<PaypalLink>,
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
    println!("{}", buffer_str);
    let buffer = buffer_str.as_bytes();

    let auth = base64::encode(&buffer);

    let client = reqwest::Client::new();

    println!("before generate request----------");

    println!("{}", auth);

    let response = client
        .post(format!(
            "{}/v1/oauth2/token",
            env::var("PAYPAL_BASE_URL").expect("set paypal base url in env")
        ))
        .body("grant_type=client_credentials")
        .header(AUTHORIZATION, format!("Basic {}", auth))
        .send()
        .await?;

    println!("after generate request----------");
    let data = response.json::<PaypalAccessTokenResponse>().await?;

    Ok(data.access_token)
}

pub async fn create_order(lesson: LessonType) -> Result<PaypalCreateOrderResponse, CustomError> {
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
    let lesson_name = lesson.get_name();

    println!("before client post----------");
    let response = client
        .post(url)
        .headers(headers)
        .body(
            json!({
                "intent": "CAPTURE",
                "purchase_units": [
                    {

                        "items": [
                            {
                                "name": lesson_name,
                                "description": description,
                                "quantity": "1",
                                "unit_amount": {
                                    "currency_code": "GBP",
                                    "value": price
                                }

                            }
                        ],
                        "amount": {
                            "currency_code": "GBP",
                            "value": price,
                            "breakdown": {
                                "item_total": {
                                    "currency_code": "GBP",
                                    "value": price
                                }
                            }
                        },
                        "description": description,

                    }
                ]
            })
            .to_string(),
        )
        .send()
        .await?;

    println!("after client post----------");
    let text = response.text().await?;

    println!("text: {}", text);
    let data = serde_json::from_str::<PaypalCreateOrderResponse>(&text).unwrap();

    Ok(data)
}

pub async fn capture_payment(
    order_id: &str,
) -> Result<(PaypalCapturePaymentResponse), CustomError> {
    let access_token = generate_paypal_access_token().await?;
    let url = format!(
        "{}/v2/checkout/orders/{}/capture",
        env::var("PAYPAL_BASE_URL").expect("set the paypal base url var"),
        order_id
    );

    let client = reqwest::Client::new();
    let mut headers = HeaderMap::new();
    println!("before headers ------------------------");
    headers.insert(
        CONTENT_TYPE,
        HeaderValue::from_str("application/json").unwrap(),
    );
    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str(format!("Bearer {}", access_token).as_str()).unwrap(),
    );

    println!("after headers ------------------------");
    let response = client.post(&url).headers(headers).send().await?;

    let data = response.json::<PaypalCapturePaymentResponse>().await?;

    Ok(data)
}
