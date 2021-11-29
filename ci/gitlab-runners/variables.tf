variable "aws_region" {
  description = "AWS region."
  type        = string
  default     = "ap-southeast-2"
}

variable "environment" {
  description = "A name that identifies the environment, will used as prefix and for tagging."
  type        = string
  default     = "asap-gitlab-runner"
}

variable "public_ssh_key_filename" {
  default = "generated/id_rsa.pub"
}

variable "private_ssh_key_filename" {
  default = "generated/id_rsa"
}

variable "runner_name" {
  description = "Name of the runner, will be used in the runner config.toml"
  type        = string
  default     = "gitlab-runner"
}

variable "gitlab_url" {
  description = "URL of the gitlab instance to connect to."
  type        = string
  default     = "https://gitlab.com/"
}

variable "registration_token" {
}

variable "timezone" {
  description = "Name of the timezone that the runner will be used in."
  type        = string
  default     = "Europe/London"
}
