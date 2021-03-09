# asap-hub

> The monorepo for the backend, frontend, and infrastructure of the [ASAP](https://parkinsonsroadmap.org/) hub.

## Requirements

### Node.js

To work on this repository, you need to have [Node.js](https://nodejs.org/) installed. We are using the version specified in the [`.nvmrc`](.nvmrc) file. If you use [NVM](https://github.com/nvm-sh/nvm), running `nvm use` in the repo root will switch to the right version automatically.

### Yarn

You need to have [Yarn](https://yarnpkg.com/) installed. Any recent version (>=1.22) will automatically detect our local Yarn version and use that, so your exact version does not matter.
The [zero-install strategy](https://yarnpkg.com/features/zero-installs) means that you do not need to run `yarn` after checking out the repository, all of the scripts will just work™.

## Repo structure

This repository consists of packages and apps along with their tests inside the individual folders inside `/packages` and `/apps`. Packages are meant for consumption by other packages or apps, while apps are not depended on by other packages or apps but instead have build artifacts like a website bundle to be served by a web server, or a JavaScript application to be run by a Node.js process.

## Scripts

This is a list of the scripts that you will commonly need to run locally in the repo root and their descriptions.
For a full list of root scripts, look inside [`package.json`](package.json).
For a list of individual package and particularly app scripts, look inside the readme file or `package.json` of the individual package or app.

- `yarn build` - This will typecheck and build all packages and apps in the repository. You may want to run this e.g. after checking out a branch.
- `yarn watch:babel` - This will watch all the packages (but not apps) for changes and whenever changes occur, build them, so that other packages and apps can use the changes.
- `yarn watch:typecheck` - This will watch all the packages (but not apps) for changes and whenever changes occur, typecheck them and emit new type definitions, so that other packages and apps can see the new module type signature.
- `yarn start:backend` - Prepares the local dev environment for the backend (e.g. AWS, database) and serves all lambda functions across all backend `apps`.
- `yarn fix:format` - This will reformat all files in the repository to match our formatting standards using [Prettier](https://prettier.io/).
- `yarn test` - This will lint and test all packages and apps in the repository. You may want to run this with `--watch` or other [Jest CLI options](https://jestjs.io/docs/en/cli.html).
- `yarn test:*` - There are further test configurations being run on CI that are usually slower or more specific and thus not suitable to run during day-to-day development. You can execute those scripts manually. Some of them may require installing native modules via `yarn rebuild` first.

## Setting up your development environment

For you, a newcomer, to be running your development setup, you'll need to complete the following steps:

### Create a new user on Squidex

- Log in to https://cloud.squidex.io/app/asap-hub-dev
- In `Content/Users`, create a new user (or edit if already created)
- While creating, or editing the user, on `Functional/Connections`, add a new item to store your UUID (you can generate a random one [here](https://www.uuidgenerator.net/version4)) and save that (the save button is the blue one on top!). You'll need that UUID later, so save it.

### Get everything running

- create a `.env` file and update it with the necessary details (ask someone for this)
- You can run all apps in the project with a simple `yarn start` on the project's root. It will load up everything, but you don't need to run everything. Depending on what you're doing, you only need some apps up
- `yarn watch:babel`: to have babel watching and compiling for you (you'll need this running most of the time)
- `yarn watch:typecheck`: well... for types checking (you'll need this running most of the time)
- `yarn start:backend`: to run the backend
- `yarn start:frontend`: to run the frontend
- `yarn start:storybook`: to run storybook

### Now that everything's up

- On localhost:3000 you should have the hub running. You'll need to get your profile created.
- Get your UUID from the previous step, and use it on https://dev.hub.asap.science/welcome/{uuid}
- Reload localhost:3000 and you should now have an account and be logged in.

## Editor setup

Refer to [this Yarn documentation page](https://yarnpkg.com/advanced/editor-sdks) for how to integrate your editor with the TypeScript compiler and ESLint linter in this repository. You will also need to set up your editor to run ESLint with the same CLI options that the scripts do—they are in [this file](jest-runner-eslint.config.js).

## Further documentation

Individual `packages` or `apps` may contain their own readme files as deemed necessary.
The [`docs`](docs) folder contains overall architecture / decision documentation.
The [`dev`](dev) folder contains documentation regarding the local dev environment for the backend.

## License

The source code of this project is licensed under the MIT License.
A copy of it can be found [alongside the repository files](LICENSE.txt).
This repository contains some externally created content, such as logos, that are not included in this licensing.
