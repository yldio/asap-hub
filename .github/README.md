# GitHub

## Docker Images

### Image name

The current image tag in use is: 1de8c60b2214fbca2e0959aa7f473c55bbc2e014

### Build new image

The docker images are built using a GitHub Action workflow - build-images.yml.

If manually trigger, this will build the images defined in the Dockerfile and are pushed to the GitHub Container registry with the following tags:

- latest
- SHA of the commit

2 images are available:

node-python-sq
squidex-utils

These are currently set to build only on master, and the images used in the
GitHub workflows are fixed to the SHA.

To build new images:

- Update build-images.yml to build from the current branch and not master.
- Update the Dockerfile and push the changes.

To change the image tag, run:

```shell
  gsed -i s/1de8c60b2214fbca2e0959aa7f473c55bbc2e014/some-new-tag/g .github/**/*.yml .github/README.md
```

## Manage GitHub workflow runs logs

To remove logs:

- List the workflow runs:

```shell
sh .github/scripts/manage-workflows/list-workflows.sh
```

- Find the Id of the workflow to delete.

```text
"Pipeline Test"
21969391
".github/workflows/single-pipeline.yml"
```

- use the Id to delete the workflow runs:

```shell
  sh .github/scripts/manage-workflows/delete-workflow-runs.sh 21969391
```
