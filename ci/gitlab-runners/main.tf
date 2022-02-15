data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_security_group" "default" {
  name   = "default"
  vpc_id = module.vpc.vpc_id
}

data "aws_caller_identity" "current" {}

terraform {
  backend "s3" {
    bucket = "s3-terraform-asap-hub-state"
    key    = "global/aws/gitlab-runner-austrialia.tfstate"
    region = "eu-west-1"
  }

  required_version = ">= 1.0.11"
}


module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "2.70"

  name = "vpc-${var.environment}"
  cidr = "10.0.0.0/16"

  azs             = [data.aws_availability_zones.available.names[0]]
  private_subnets = ["10.0.1.0/24"]
  public_subnets  = ["10.0.101.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
  enable_s3_endpoint = true

  tags = {
    Environment = var.environment
  }
}
module "gitlab-runner" {
  source  = "npalm/gitlab-runner/aws"
  version = "4.35.0"

  aws_region  = var.aws_region
  environment = var.environment

  vpc_id                   = module.vpc.vpc_id
  subnet_ids_gitlab_runner = module.vpc.private_subnets
  subnet_id_runners        = element(module.vpc.private_subnets, 0)
  metrics_autoscaling      = ["GroupDesiredCapacity", "GroupInServiceCapacity"]

  runners_name             = var.runner_name
  runners_gitlab_url       = var.gitlab_url
  enable_runner_ssm_access = true

  cache_bucket_prefix = "aus"

  gitlab_runner_security_group_ids = [data.aws_security_group.default.id]

  docker_machine_download_url   = "https://gitlab-docker-machine-downloads.s3.amazonaws.com/v0.16.2-gitlab.10/docker-machine-Linux-x86_64"
  docker_machine_spot_price_bid = "0.09"
  docker_machine_instance_type  = "m5.xlarge"
  gitlab_runner_version         = "14.7.0"
  runners_concurrent            = 10

  gitlab_runner_registration_config = {
    registration_token = var.registration_token
    tag_list           = "docker-spot-runner"
    description        = "runner default - auto"
    locked_to_project  = "true"
    run_untagged       = "false"
    maximum_timeout    = "3600"
  }

  tags = {
    "tf-aws-gitlab-runner:instancelifecycle" = "spot:yes"
  }

  runners_privileged         = "true"
  runners_additional_volumes = ["/certs/client"]

  runners_volumes_tmpfs = [
    {
      volume  = "/var/opt/cache",
      options = "rw,noexec"
    }
  ]

  runners_services_volumes_tmpfs = [
    {
      volume  = "/var/lib/mysql",
      options = "rw,noexec"
    }
  ]

  # working 8 to 6
  runners_machine_autoscaling = [
    {
      periods    = ["\"* * 0-8,18-23 * * mon-fri *\"", "\"* * * * * sat,sun *\""]
      idle_count = 0
      idle_time  = 60
      timezone   = var.timezone
    }
  ]
  runners_install_amazon_ecr_credential_helper = "true"
  runners_environment_vars = ["DOCKER_AUTH_CONFIG=${jsonencode({
    "credHelpers" = { "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com" : "ecr-login" }
    })}"
  ]



}

resource "null_resource" "cancel_spot_requests" {
  # Cancel active and open spot requests, terminate instances
  triggers = {
    environment = var.environment
  }

  provisioner "local-exec" {
    when    = destroy
    command = "./bin/cancel-spot-instances.sh ${self.triggers.environment}"
  }
}
