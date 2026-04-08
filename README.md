# asap-hub

> The monorepo for the backend, frontend, and infrastructure of the [ASAP](https://parkinsonsroadmap.org/) hub

[![Pipeline development and production](https://github.com/yldio/asap-hub/actions/workflows/on-push-master.yml/badge.svg)](https://github.com/yldio/asap-hub/actions/workflows/on-push-master.yml)

## Authentication

This project uses [Auth0](https://auth0.com/) for authentication in both the CRN and GP2 apps. User accounts are managed through Contentful — each user in the app corresponds to a `User` content entry in Contentful, and Auth0 handles the actual login flow. See [Setting up your development environment](#setting-up-your-development-environment) for how to create a local user.

## Requirements

### Node.js

To work on this repository, you need to have [Node.js](https://nodejs.org/) installed. We are using the version specified in the [`.nvmrc`](.nvmrc) file. If you use [NVM](https://github.com/nvm-sh/nvm), running `nvm use` in the repo root will switch to the right version automatically. If you use [ASDF](https://asdf-vm.com/) set up with the `nodejs` module, running `asdf install` will do the same.

### Yarn

You need to have [Yarn](https://yarnpkg.com/) installed. Any recent version (>=1.22) will automatically detect our local Yarn version and use that, so your exact version does not matter.
The [zero-install strategy](https://yarnpkg.com/features/zero-installs) means that you do not need to run `yarn` after checking out the repository, all of the scripts will just work™.

IDEs require special configuration for TypeScript to work when using Plug'n'Play installs.

- [vscode](https://yarnpkg.com/getting-started/editor-sdks#vscode)
- [vim](https://yarnpkg.com/getting-started/editor-sdks#vim)

#### Emacs

- [instructions (see below)](https://yarnpkg.com/getting-started/editor-sdks#emacs)

The `.dir-locals.el` configuration file has already been created in the repository, so you just need to run the following command in the root directory of the project:

```sh
yarn dlx @yarnpkg/sdks base
```

## Repo structure

This repository consists of packages and apps along with their tests inside the individual folders inside `/packages` and `/apps`. Packages are meant for consumption by other packages or apps, while apps are not depended on by other packages or apps but instead have build artifacts like a website bundle to be served by a web server, or a JavaScript application to be run by a Node.js process.

## Scripts

For a full list of root scripts, look inside [`package.json`](package.json).
For a list of individual package and app scripts, look inside the readme file or `package.json` of the individual package or app.

### Development

| Script                    | Description                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| `yarn watch`              | Watch all packages and run babel + typecheck on changes (recommended during development) |
| `yarn watch:babel`        | Watch packages and rebuild with Babel on changes                                         |
| `yarn watch:typecheck`    | Watch packages and re-emit type definitions on changes                                   |
| `yarn start:crn`          | Run both the CRN backend and frontend                                                    |
| `yarn start:gp2`          | Run both the GP2 backend and frontend                                                    |
| `yarn start:backend:crn`  | Run only the CRN backend                                                                 |
| `yarn start:frontend:crn` | Run only the CRN frontend                                                                |
| `yarn start:backend:gp2`  | Run only the GP2 backend                                                                 |
| `yarn start:frontend:gp2` | Run only the GP2 frontend                                                                |
| `yarn start:storybook`    | Run Storybook                                                                            |
| `yarn start`              | Run all apps                                                                             |

### Build & test

| Script                  | Description                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `yarn build`            | Typecheck and build all packages and apps                                                                                 |
| `yarn test`             | Lint and test all packages and apps (supports `--watch` and other [Jest CLI options](https://jestjs.io/docs/en/cli.html)) |
| `yarn test:integration` | Run integration tests for the API against Contentful                                                                      |
| `yarn test:*`           | Further CI-specific test configurations (slower; some require `yarn rebuild` first)                                       |
| `yarn lint`             | Run linting (requires `yarn build:typecheck` first)                                                                       |
| `yarn fix:format`       | Reformat all files using [Prettier](https://prettier.io/)                                                                 |

## Setting up your development environment

For you, a newcomer, to be running your development setup, you'll need to complete the following steps:

### Get everything running

- Create a `.env` file from the example:

  ```sh
  cp .env.example .env
  ```

  The following fields are already pre-filled in `.env.example` and should work out of the box for the development environment. You will need to ask a colleague for the values of the fields that are left blank:

  | Field                                                                                             | Required for                             |
  | ------------------------------------------------------------------------------------------------- | ---------------------------------------- |
  | `CONTENTFUL_ACCESS_TOKEN`                                                                         | CRN backend (reading content)            |
  | `CONTENTFUL_PREVIEW_ACCESS_TOKEN`                                                                 | CRN backend (draft/preview content)      |
  | `ALGOLIA_API_KEY`                                                                                 | Search functionality                     |
  | `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN`                                                              | Running Contentful migrations (optional) |
  | `GP2_CONTENTFUL_SPACE_ID` + `GP2_CONTENTFUL_ACCESS_TOKEN` + `GP2_CONTENTFUL_PREVIEW_ACCESS_TOKEN` | GP2 backend (optional)                   |
  | `OPENAI_API_KEY`                                                                                  | AI features (optional)                   |

- You can run all apps with `yarn start`, but you typically only need a subset. See the [Scripts](#scripts) section for the full list of available start commands. During development you will almost always want `yarn watch` running alongside your app.

### Now that everything's up

- On <http://localhost:3000> you should have the CRN hub running
- On <http://localhost:4000> you should have the GP2 hub running

### Create a user on Contentful

To log in you need a `User` entry in Contentful linked to your email:

- Log in to <https://www.contentful.com/>
- You will need to be added to the "YLD ASAP > CRN Hub" or "YLD ASAP > GP2" app if you don't already have access
- In the environment selector in the top left, select `Development` (or `Production` if required)
- In the "Content" section, create a new `User` content entry with your email address

### Logging in

The apps use Auth0 for authentication — there is no traditional username/password. To log in:

1. Click the **Login** button on the app homepage
2. You will be redirected to the Auth0 login page; enter the email address of the Contentful user you created
3. If this is your first login, check your email for an invitation link from Auth0

If you do not receive an invitation email, copy the value from the `Connections` field on your Contentful user and visit:

```
https://dev.hub.asap.science/welcome/{invitation-code}
```

To send a new invitation, remove the value from the `Connections` field in Contentful and save.

## Editor setup

Refer to [this Yarn documentation page](https://yarnpkg.com/advanced/editor-sdks) for how to integrate your editor with the TypeScript compiler and ESLint linter in this repository. You will also need to set up your editor to run ESLint with the same CLI options that the scripts do — they are in [this file](jest-runner-eslint.config.js).

## Further documentation

Individual `packages` or `apps` may contain their own readme files as deemed necessary.
The [`docs`](docs) folder contains overall architecture / decision documentation.

## Contentful

### Dedicated Environment

If you require a dedicated environment for your development work, create a PR and add one or both of the following labels. This will trigger a GitHub Actions workflow to create a new Contentful environment and a duplicate of the Algolia entity index.

- `crn-create-environment`
- `gp2-create-environment`

You should create a dedicated environment if:

- you are making any changes to the content models in Contentful
- you need to develop/test webhook behaviour as part of your PR

When using a dedicated environment, ensure your API keys have permission to access it. Check your API key settings at <https://app.contentful.com/spaces/5v6w5j61tndm/environments/master/api/keys>.

### Analytics Algolia Dedicated Environment

If you need to make changes to Analytics Algolia indexes, add the following label to your PR. This triggers a GitHub Actions workflow that creates a copy of the relevant indexes.

- `crn-create-analytics-algolia-index`

To avoid unnecessary costs, only use this when making changes to Analytics indexes, and delete the indexes when your PR is closed or merged.

### Update Postmark templates

To deploy Postmark template changes from your branch, add the following label to your PR:

- `postmark-templates-update`

Note: this does NOT create a dedicated server — all branches sharing this label use the same Postmark branch server.

### Schema changes and graphql

The graphql schema, and associated types are generated automatically by Contentful. When you make changes to graphql queries, or to the content models in Contentful you will need to regenerate the schema documents. You can do this by running the following command:

```sh
yarn contentful:schema:update

# or for CRN or GP2 individually
yarn contentful:schema:update:crn
yarn contentful:schema:update:gp2
```

Then commit the changed files.

### Backup

There is a GitHub Actions workflow to backup and restore Contentful data.

Backups are done twice a day for production and once a day for dev. You can trigger a data restoration from the action menu ([click here](https://github.com/yldio/asap-hub/actions/workflows/on-demand-contentful-restore.yml)). This can be done using production or development data and target custom environments.

- [on-schedule-backup-prod.yml](./.github/workflows/on-schedule-backup-prod.yml) to backup from prod
- [on-schedule-backup-dev.yml](./.github/workflows/on-schedule-backup-dev.yml) to backup from dev
- [on-demand-contentful-restore.yml](./.github/workflows/on-demand-contentful-restore.yml) to restore backup data.

### Migrations

In order to support the migration from Squidex to Contentful, we've set up a migration system which allows us to track our changes on a per-content type basis, and preserve the history. This is done using [contentful-migrate](https://github.com/deluan/contentful-migrate), a thin third-party wrapper around the official [contentful-migration](https://github.com/contentful/contentful-migration) tool.

#### Creating a New Migration

Once you've completed the steps above, you can create a new migration file with:

```sh
   MIGRATION_TYPE=<content_type> MIGRATION_NAME=<name> yarn contentful:migration:create:<app_name>
```

So if you wanted to add a `foo` field to the `bar` content type:

```sh
   MIGRATION_TYPE=bar MIGRATION_NAME=add-foo-field yarn contentful:migration:create:crn
```

Note: the `content_type` is the slug, not the display name, so `externalAuthors` not `External Authors`.

#### Generating the migration with a script

The same way we can make changes in Squidex UI and sync them with our local schemas, it's possible to create a new content type or modify an existing one and generate the migration, so you don't need to type all fields you want to include or remove from the content type.

This is possible using the `space generate migration` command from Contentful CLI. Reference: https://github.com/contentful/contentful-cli/tree/master/docs/space/generate/migration.

So, if you want to create or modify a content type using the approach above, you need to follow these steps:

1. Create manually a new environment
   1. Access https://app.contentful.com/spaces/5v6w5j61tndm/environments/master/settings/environments
   2. Click Add environment button
   3. Give it a name and clone the new environment from Production
2. Access the environment you created in step 1 and make the changes you want in the content type
3. Adjust your `.env` file with `CONTENTFUL_SPACE_ID` being `5v6w5j61tndm` and `CONTENTFUL_ENV_ID` being the name you gave to your environment in step `1.3`.
4. Run the script to generate the migration

   ```sh
   MIGRATION_TYPE=media yarn contentful:migration:generate:gp2
   ```

   This will generate a file with the `up` part of the migration. Be aware that you might need to edit a few things. For example, if you are editing an existing content model, you will have to change `createContentType` to `editContentType` in the generated migration.

5. Remember to delete this environment after you finish your PR.

#### Initiating an Environment

_Note: This is not something you will need to do regularly, I have documented it for the rare case where you are creating a new environment from scratch and not cloning one which is already using migrations._

The following command will create the migration content schema:

```sh
yarn workspace @asap-hub/contentful ctf-migrate init
```

#### Counting Migrations to be Run

If you want to know the number of migrations which have not yet been applied to the target environment:

```sh
yarn contentful:migration:count:crn
yarn contentful:migration:count:gp2
```

#### Running Migrations

To run outstanding migrations, first do a dry run:

```sh
yarn contentful:migration:dryrun:crn
yarn contentful:migration:dryrun:gp2
```

If all looks good, repeat with the commands.

```sh
yarn contentful:migration:run:crn
yarn contentful:migration:run:gp2
```

There are also convenience methods for this:

- `yarn workspace @asap-hub/contentful space:migrate:crn:dryrun`
- `yarn workspace @asap-hub/contentful space:migrate:crn`

#### Rolling back a Migration

Rollbacks are per-content type, and can be used like this:

```sh
CONTENTFUL_MIGRATIONS_DIR=migrations/crn yarn ctf-migrate down -c <content_type> --dry-run
```

Then repeat the command without `--dry-run` if all looks good.

## Docker Images

### Image name

The current image tag in use is: 86a189edc900d4e1afdcf3935c697292f69d409b

### Build new image

The docker images are built using a GitHub Action workflow - build-images.yml.

If manually trigger, this will build the images defined in the Dockerfile and are pushed to the GitHub Container registry with the following tags:

- latest
- SHA of the commit

images available:

node-python-sq

These are currently set to build only on master, and the images used in the
GitHub workflows are fixed to the SHA.

To build new images:

- Update build-images.yml to build from the current branch and not master.
- Update the Dockerfile and push the changes.

To change the image tag, run:

```sh
  gsed -i s/86a189edc900d4e1afdcf3935c697292f69d409b/some-new-tag/g .github/**/*.yml README.md
```

## Manage GitHub workflow runs logs

To remove logs:

- List the workflow runs:

```sh
sh .github/scripts/manage-workflows/list-workflows.sh
```

- Find the Id of the workflow to delete.

```text
"Pipeline Test"
21969391
".github/workflows/single-pipeline.yml"
```

- use the Id to delete the workflow runs:

```sh
  sh .github/scripts/manage-workflows/delete-workflow-runs.sh 21969391
```

## Accessing AWS

For AWS access please use the guide here: <https://www.notion.so/AWS-0e3cc65f60524aa4b65e1ee7c2029270>

## License

The source code of this project is licensed under the MIT License.
A copy of it can be found [alongside the repository files](LICENSE.txt).
This repository contains some externally created content, such as logos, that are not included in this licensing
