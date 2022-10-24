use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::ballet_classes::model::BalletClass;
use crate::schema::orders;

#[derive(Queryable, Deserialize, Serialize, Insertable, Identifiable, Associations)]
#[table_name = "orders"]
pub struct Order {
    pub id: String,
    pub completed: bool,
    pub transaction_id: Option<String>,
    pub created_at: chrono::NaiveDateTime,
}

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
    pub access_token: String,
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
