terraform {
  required_version = ">= 0.12"

  backend "s3" {
    bucket = "asap-hub-development-tf-state"
    key    = "workspaces"
  }
}

provider "aws" {
  version = "2.63"
}

data "aws_route53_zone" "external" {
  name = var.domain
}

resource "aws_acm_certificate" "cert" {
  domain_name               = join(".", compact([var.subdomain, var.domain]))
  subject_alternative_names = [join(".", compact(["*", var.subdomain, var.domain]))]
  validation_method         = "DNS"
}

resource "aws_route53_record" "validation" {
  name    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.external.zone_id
  records = [aws_acm_certificate.cert.domain_validation_options.0.resource_record_value]
  ttl     = "60"
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn = aws_acm_certificate.cert.arn
  validation_record_fqdns = [
    aws_route53_record.validation.fqdn
  ]
}
