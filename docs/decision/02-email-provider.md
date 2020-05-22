# Email provider

Status: Final

Date: 2020-05-19

Author: Filipe Pinheiro <filipe@yld.io>

Reviewed-by: Tim Seckinger <tim.seckinger@yld.io>

## Context

The majority of web applications uses email as a communication channel. The ASAP Hub is no different, and emails are a way to keep the communication with users.

The requirements for an email service are the following:

- **HTTP API**. The API allows us to send emails to our users programmatically. The API also works as the integration point and an excellent candidate to decouple sending emails from the other responsibilities of the service.
- Provide a **template** engine. To create a consistent experience and mitigate misconfigured and poorly formatted emails, it's a good practice to have a template and send the data to fill the model to the email provider. The creation of the templates also enables us to decouple their production and test them in isolation.
- Provide an **SMTP** configuration. [Auth0](../spike/0016-auth0.md) integrates seamlessly with several email services, but SMTP is also an option for the others.
- (Optional) Track events about the emails sent

## Options

The providers we looked into that fit he previous requirements were:

- [Amazon SES](https://aws.amazon.com/ses/)
- [Postmark](https://postmarkapp.com/)
- [SendGrid](https://sendgrid.com/)
- [Mailchimp](https://mailchimp.com/)
- [Mailgun](https://www.mailgun.com/)
- [SparkPost](https://www.sparkpost.com/)

## Decision

At this stage of development, we decide to use Amazon SES. The disadvantage of using Amazon SES is the lack of a dashboard and the visibility of the emails sent. Still, we believe that the ease of integration at this stage of the project is important to deliver the first user stories quickly. We will make sure that the email provider can be changed with reasonable effort in the future.
