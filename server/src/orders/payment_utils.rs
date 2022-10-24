use crate::ballet_classes::model::{ClassName, CourseName};
use crate::error_handler::CustomError;
use crate::orders::model::{PaypalAccessTokenResponse, PaypalCreateOrderResponse};
use base64;
use reqwest;
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use serde_json::{self, json};
use std::env;

use super::model::PaypalCapturePaymentResponse;

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

pub async fn create_order(
    class_name: ClassName,
    is_course: Option<bool>,
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

    let item_price = class_name.get_lesson_price();
    let mut total_price = item_price.clone();
    let mut item_quantity = String::from("1");
    if is_course.is_some() {
        let course_name = CourseName::from_class_name(&class_name)?;
        total_price = course_name.get_price();
        item_quantity = course_name.get_classes_quantity();
    }

    let description = class_name.get_description();
    let lesson_name = class_name.get_name();

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
                                "quantity": item_quantity,
                                "unit_amount": {
                                    "currency_code": "GBP",
                                    "value": item_price
                                }

                            }
                        ],
                        "amount": {
                            "currency_code": "GBP",
                            "value": total_price,
                            "breakdown": {
                                "item_total": {
                                    "currency_code": "GBP",
                                    "value": total_price
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
