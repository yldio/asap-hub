# GitLab runners on AWS

The implementation relies on the <https://github.com/npalm/terraform-aws-gitlab-runner> terraform module.
We use the [runner default example](https://github.com/npalm/terraform-aws-gitlab-runner/tree/develop/examples/runner-default) with some tweaks.

- We use s3 backend to store state
- Due to [#307](https://github.com/npalm/terraform-aws-gitlab-runner/issues/307) we override `docker_machine_download_url`
- And adjusted `runners_machine_autoscaling` for our working hours
- moved from eu-west-1 to ap-southeast-2 to try to avoid spot instance capacity terminations.

To set it up use `terraform` and you should be presented with a prompt to insert the `registration_token` from [gitlab to enable installation of a specific runner](https://gitlab.com/yldio/asap-hub/-/settings/ci_cd) :

```sh
terraform init
terraform apply
```

## Prerequisites

### Terraform

Ensure you have Terraform installed. The modules is based on Terraform 0.11, see `.terraform-version` for the used version. A handy tool to mange your Terraform version is [tfenv](https://github.com/kamatama41/tfenv).

On macOS it is simple to install `tfenv` using `brew`.

```sh
brew install tfenv
```

To use the correct version:

```sh
tfenv use
```

To install a Terraform version.

```sh
tfenv install <version>
```

## Troubleshooting

The first time we ran this, the setup didn't complete successfully. Since an autoscaling group ensures we always have a master machine to manage jobs, we just terminated the instance and waited for autoscaling to do its job.
