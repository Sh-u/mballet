use std::error::Error;

use crate::error_handler::CustomError;

use alcoholic_jwt::{token_kid, validate, Validation, JWKS};
#[allow(dead_code)]
async fn fetch_jwks(uri: &str) -> Result<JWKS, Box<dyn Error>> {
    let val = reqwest::get(uri)
        .await
        .expect("Failed to get a response at fetch_jwks")
        .json()
        .await?;

    println!("JWKS: {:#?}", val);
    Ok(val)
}
#[allow(dead_code)]
pub async fn validate_token(token: &str) -> Result<bool, CustomError> {
    let authority = std::env::var("AUTHORITY").expect("Set the AUTHORITY env");
    let jwks = fetch_jwks(&format!(
        "{}{}",
        authority.as_str(),
        ".well-known/jwks.json"
    ))
    .await
    .expect("failed to fetch the jwks at validate_token");

    let validations = vec![Validation::Issuer(authority), Validation::SubjectPresent];

    let kid = match token_kid(&token) {
        Ok(res) => res.expect("failed to decode the kid!"),
        Err(_) => return Err(CustomError::new(401, "JWKS fetch error")),
    };

    println!("kid : {}", kid);

    let jwk = jwks
        .find(&kid)
        .expect("Couldn't find a specified key in the set");

    println!("jwk find : {:#?}", jwk);

    let res = validate(token, jwk, validations);

    Ok(res.is_ok())
}
