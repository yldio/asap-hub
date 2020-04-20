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
- `yarn fix:format` - This will reformat all files in the repository to match our formatting standards using [Prettier](https://prettier.io/).
- `yarn test` - This will lint and test all packages and apps in the repository. You may want to run this with `--watch` or other [Jest CLI options](https://jestjs.io/docs/en/cli.html).

## Editor setup

Refer to [this Yarn documentation page](https://yarnpkg.com/advanced/editor-sdks) for how to integrate your editor with the TypeScript compiler in this repository.

## Further documentation

Individual `packages` or `apps` may contain their own readme files as deemed necessary.
The [`docs`](docs) folder contains overall architecture / decision documentation.
