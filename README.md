# asap-hub

> The monorepo for the backend, frontend, and infrastructure of the [ASAP](https://parkinsonsroadmap.org/) hub

[![Pipeline development and production](https://github.com/yldio/asap-hub/actions/workflows/on-push-master.yml/badge.svg)](https://github.com/yldio/asap-hub/actions/workflows/on-push-master.yml)

## Requirements

### Node.js

To work on this repository, you need to have [Node.js](https://nodejs.org/) installed. We are using the version specified in the [`.nvmrc`](.nvmrc) file. If you use [NVM](https://github.com/nvm-sh/nvm), running `nvm use` in the repo root will switch to the right version automatically.

### Yarn

You need to have [Yarn](https://yarnpkg.com/) installed. Any recent version (>=1.22) will automatically detect our local Yarn version and use that, so your exact version does not matter.
The [zero-install strategy](https://yarnpkg.com/features/zero-installs) means that you do not need to run `yarn` after checking out the repository, all of the scripts will just work™.

IDEs require special configuration for TypeScript to work when using Plug'n'Play installs.

- [vscode](https://yarnpkg.com/getting-started/editor-sdks#vscode)
- [vim](https://yarnpkg.com/getting-started/editor-sdks#vim)

#### Emacs

- [instructions (see below)](https://yarnpkg.com/getting-started/editor-sdks#emacs)

The `.dir-locals.el` configuration file has already been created in the repository, so you just need to run the following command in the root directory of the project:

```
yarn dlx @yarnpkg/sdks base
```

## Repo structure

This repository consists of packages and apps along with their tests inside the individual folders inside `/packages` and `/apps`. Packages are meant for consumption by other packages or apps, while apps are not depended on by other packages or apps but instead have build artifacts like a website bundle to be served by a web server, or a JavaScript application to be run by a Node.js process.

## Scripts

This is a list of the scripts that you will commonly need to run locally in the repo root and their descriptions.
For a full list of root scripts, look inside [`package.json`](package.json).
For a list of individual package and particularly app scripts, look inside the readme file or `package.json` of the individual package or app.

- `yarn build` - This will typecheck and build all packages and apps in the repository. You may want to run this e.g. after checking out a branch.
- `yarn watch:babel` - This will watch all the packages (but not apps) for changes and whenever changes occur, build them, so that other packages and apps can use the changes.
- `yarn watch:typecheck` - This will watch all the packages (but not apps) for changes and whenever changes occur, typecheck them and emit new type definitions, so that other packages and apps can see the new module type signature.
- `yarn fix:format` - This will reformat all files in the repository to match our formatting standards using [Prettier](https://prettier.io/).
- `yarn test` - This will lint and test all packages and apps in the repository. You may want to run this with `--watch` or other [Jest CLI options](https://jestjs.io/docs/en/cli.html).
- `yarn test:*` - There are further test configurations being run on CI that are usually slower or more specific and thus not suitable to run during day-to-day development. You can execute those scripts manually. Some of them may require installing native modules via `yarn rebuild` first.

## Setting up your development environment

For you, a newcomer, to be running your development setup, you'll need to complete the following steps:

### Create a new user on Squidex

- Log in to <https://cloud.squidex.io/app/asap-hub-dev>
- In `Content/Users`, create a new user (or edit if already created)

### Get everything running

- create a `.env` file and update it with the necessary details (ask one of the engineers for a working config, there is a `.env.example` file to work from, but you'll need the details)
- You can run all apps in the project with a simple `yarn start` on the project's root. It will load up everything, but you don't need to run everything. Depending on what you're doing, you only need some apps up
- `yarn watch:babel`: to have babel watching and compiling for you (you'll need this running most of the time)
- `yarn watch:typecheck`: well... for types checking (you'll need this running most of the time)
- `yarn watch`: to have babel and type checking watching and compiling for you
- `yarn start:backend:crn`: to run the CRN backend
- `yarn start:frontend:crn`: to run the CRN frontend
- `yarn start:backend:gp2`: to run the GP2 backend
- `yarn start:frontend:gp2`: to run the GP2 frontend
- `yarn start:storybook`: to run storybook
- `yarn start:crn` - to run both the CRN backend and frontend
- `yarn start:gp2` - to run both the GP2 backend and frontend
- `yarn start`: to run all of the above

### Now that everything's up

- On localhost:3000 you should have the CRN hub running. You'll need to get your profile created.
- On localhost:4000 you should have the GP2 hub running. You'll need to get your profile created.
- Get your UUID from the previous step, and use it on <https://dev.hub.asap.science/welcome/{uuid>}
- Reload localhost:3000 and you should now have an account and be logged in.

## Editor setup

Refer to [this Yarn documentation page](https://yarnpkg.com/advanced/editor-sdks) for how to integrate your editor with the TypeScript compiler and ESLint linter in this repository. You will also need to set up your editor to run ESLint with the same CLI options that the scripts do — they are in [this file](jest-runner-eslint.config.js).

## Further documentation

Individual `packages` or `apps` may contain their own readme files as deemed necessary.
The [`docs`](docs) folder contains overall architecture / decision documentation.

## Squidex schema changes and graphql

Squidex is our content management software, and manages our data. When you want to make a change, there are a specific set of steps which need to be taken in order to ensure that the software builds correctly.

First of all, make the schema changes you want on your PR branch via [the Squidex UI](https://squidex.io), the details to log into the ops account are available from the team. You'll also want to update your `.env` file with the `SQUIDEX_CLIENT_ID`, `SQUIDEX_CLIENT_SECRET` (you can get these from 'My Profile'), and `SQUIDEX_APP_NAME` (the name of your PR app instance).

After you've made and published the changes, you can regenerate the local schemas and queries by running this command (if you need to add anything to queries, you'll need to make those changes before running the command):

`yarn schema:update`

Then commit the changed files.

## Migrate squidex fields

Create a migration script with the following command:

`yarn workspace @asap-hub/crn-server migration:create <give-the-script-a-name>`

This should create a new script in:

src/apps/crn-server/src/migrations

```javascript
export default class MoveRepurposedFields extends Migration {
  up = async (): Promise<void> => {
    /* put migration code here */
  };
  down = async (): Promise<void> => {
    /* put rollback code here  */
  };
}
```

The up function is triggered by `asap-hub-{env}-runMigrations`
The down function is triggered by `asap-hub-{env}-rollbackMigrations`

## Running integration tests locally

- Install python 3
- From the root run
  ```sh
  pip3 install -r .github/scripts/squidex/requirements.txt
  ```
- Install Squidex CLI https://github.com/Squidex/squidex-samples/releases

  - For macOS + zsh users:

    In order to be able to run executable file, run in the terminal

    ```sh
    cd /directory/with/executable
    chmod +x sq
    sudo cp sq /usr/local/bin/
    ```

    For z shell users, edit ~/.zshrc and add the following line:

    ```
    alias sq=./sq
    ```

    Apply the changes running in the terminal:

    ```
    source ~/.zshrc
    ```

- Set env vars

  - For zsh users:
    Open `~/.zshenv` and add:

    ```
    export SQUIDEX_CLIENT_ID=*****
    export SQUIDEX_CLIENT_SECRET=*****
    export SQUIDEX_BASE_URL=https://cloud.squidex.io
    export SQUIDEX_APP_NAME=<choose-any-name>
    export APP=crn
    ```

    Run `source ~/.zshenv`

- Then you are going to be able to run create-app script:

  ```sh
  python3 .github/scripts/squidex/create-app.py
  ```

- Run `yarn test:integration` to see the tests running locally.

## Docker Images

### Image name

The current image tag in use is: 702f129e96908e57a5ca9572a9956409f644207f

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

```shell
  gsed -i s/702f129e96908e57a5ca9572a9956409f644207f/some-new-tag/g .github/**/*.yml README.md
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

## License

The source code of this project is licensed under the MIT License.
A copy of it can be found [alongside the repository files](LICENSE.txt).
This repository contains some externally created content, such as logos, that are not included in this licensing

```

```
