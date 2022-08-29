use std::env;

use crate::error_handler::CustomError;

use super::model::Confirmation;

use lettre::message::header::Header;
use lettre::message::{Mailbox, MultiPart, MultiPartKind};
use lettre::transport::smtp::authentication::Credentials;

use lettre::transport::smtp::client::{Tls, TlsParameters};
use lettre::{message, Message, SmtpTransport, Transport};
use native_tls::{Protocol, TlsConnector};

pub fn send_confirmation_mail(confirmation: &Confirmation) -> Result<(), CustomError> {
    let domain_url = env::var("DOMAIN_URL").expect("set DOMAIN_URL env");
    let smtp_sender = env::var("SMTP_SENDER").expect("set SMTP SENDER env");
    let smtp_host = env::var("SMTP_HOST").expect("set SMTP HOST env");
    let creds = Credentials::new(
        (env::var("SMTP_USERNAME")).expect("set SMTP USERNAME env"),
        env::var("SMTP_PASSWORD").expect("set SMTP PASSWORD env"),
    );

    let expires = confirmation
        .expires_at
        .format("%I:%M %p %A, %-d %B, %C%y")
        .to_string();

    let html_text = format!(
        "Please click on the link below to complete registration. <br/>
             <a href=\"{domain}/register?id={id}&email={email}\">Complete registration</a> <br/>
            This link expires on <strong>{expires}</strong>",
        domain = domain_url,
        id = confirmation.id,
        email = confirmation.email,
        expires = expires
    );

    let plain_text = format!(
        "Please visit the link below to complete registration:\n
        {domain}/register.html?id={id}&email={email}\n
        This link expires on {expires}.",
        domain = domain_url,
        id = confirmation.id,
        email = confirmation.email,
        expires = expires
    );

    println!("confirmation email: {}", confirmation.email);

    let email = Message::builder()
        .from(smtp_sender.parse().unwrap())
        .to(confirmation.email.to_owned().parse().unwrap())
        .subject("Mballet registration")
        .multipart(MultiPart::alternative_plain_html(plain_text, html_text))
        .map_err(|err| {
            return CustomError::new(
                400,
                format!("There was an error while creating an email: {}", err).as_str(),
            );
        })
        .unwrap();

    let tsl_params = TlsParameters::new(smtp_host.clone()).unwrap();

    let mailer = SmtpTransport::relay(smtp_host.as_str())
        .unwrap()
        .tls(Tls::Required(tsl_params))
        .credentials(creds)
        .build();

    match mailer.send(&email) {
        Ok(_) => {
            println!("Email sent");

            Ok(())
        }
        Err(err) => {
            println!("Could not send email: {}", err);
            Err(CustomError::new(400, "Could not send email"))
        }
    }
}
