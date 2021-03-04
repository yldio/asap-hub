# GitLab runners on AWS

The implementation relies on the https://github.com/npalm/terraform-aws-gitlab-runner terraform module.
We use the [runner default example](https://github.com/npalm/terraform-aws-gitlab-runner/tree/develop/examples/runner-default) with some tweaks.

- We use s3 backend to store state
- Due to [#307](https://github.com/npalm/terraform-aws-gitlab-runner/issues/307) we override `docker_machine_download_url`
- And adjusted `runners_machine_autoscaling` for our working hours

To set it up use `terraform` and you should be presented with a prompt to insert the `registration_token`:

```
$ terraform init
$ terraform apply
```

## Troubleshooting

The first time we ran this, the setup didn't complete successfully. Since an autoscaling group ensures we always have a master machine to manage jobs, we just terminated the instance and waited for autoscaling to do its job.
