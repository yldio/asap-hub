# JS infrastructure

## Repo structure

The monorepo contains projects `packages` and `apps`.
Typically, but not necessarily, `packages` have plain `.js` and `.d.ts` files as their build output, while `apps` have other things such as a bundled JS file, or web assets. `apps` tend to deviate from the default configuration more often than `packages`.
The only key distinction (essentially the definition) that must always hold true is that `apps` are not depended on by other `packages` or `apps`, while `packages` are (presently or intended to in the future)
There are also `@types` for when a package neither provides its own type definitions nor has `@types` available on the NPM registry.

## Dependency installation

Many packages have their useless `postinstall` steps disabled in `dependenciesMeta` so that we can benefit from Yarn's zero install feature and not even have to run a dependency installation script before running most scripts. For `serverless`, due to its weird plugin system, a workaround is in use to achieve this, see the `serverless` directory.

The root and some projects contain `patches` applies to some broken dependencies using the `patch:` protocol that Yarn supports.

## TypeScript / Babel

TypeScript is used only for typechecking, while Babel is used for the actual compilation.
The reasons for this are
* that Babel allows specifying more precise target platforms using Browserslist,
* that Babel allows custom plugins, such as for CSS-in-JS or inlining environment variables, and
* that Babel is much faster, so even when you have typecheck running in parallel, you get faster feedback.

Because TypeScript itself does not auto-detect all projects that are part of the workspace, the `get-composite-ts-projects` script does it. It also checks whether any `tsconfig` `references` are missing to avoid confusing errors or out-of-order typechecking later on.

Projects usually inherit their TypeScript and Babel configurations from the config files in the root, but may override things if necessary.
Most notably, some are excluded from the TypeScript multi-project setup using `composite: false`, because `create-react-app` does not allow `composite` projects. These projects then have their own `typecheck` script that is run separately from the root typecheck.
Projects usually specify the shared `build-babel.sh` script as their build step.
Some do not specify Babel as their build step, for example because they only run a script from `react-scripts` as a build step instead.

We build both CJS and ESM, the former e.g. for running in Node environments, the latter e.g. for Webpack bundling with smaller resulting bundle sizes.

## Jest / ESLint

The root Jest project ignores all test files. Instead, there are Jest projects for each project, run together in the same Jest instance.
ESLint is also run in Jest via `jest-runner-eslint` to benefit from e.g. Jest watch mode features.
The `jest` directory contains the configuration and scripts to automatically generate a Jest config for each project, and e.g. determine whether it needs a DOM or Node environment.
Projects can have their own `jest.config.js`, completely replacing the default one and also making it their responsibility to inherit from the base config.

There are some special `jest-*.config`s in the root or in projects, which run test files with a name matching their particular pattern.
