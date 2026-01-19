## Data flow from Auth0 to CRN/GP2 Frontend

When a user logs in, their data is retrieved from the backend instance at `dev.[hub/gp2].asap.science` using a webhook endpoint called by Auth0.

The code for this webhook can be found at the following paths:

- apps/crn-server/src/handlers/webhooks/fetch-by-code/fetch-by-code.ts
- apps/gp2-server/src/handlers/webhooks/fetch-by-code.ts

The code that maps the data returned by these webhooks can be found at:

- apps/auth0/src/post-login-add-metadata.ts

These files return data related to the user's profile to Auth0, which then stores it in custom claims on the ID token. The frontend extracts this data using the following React hook:

- packages/react-context/src/auth.ts

## Adding new data to webhook handlers

Since Auth0 fetches the user's profile data from the webhook at the `dev` instance (or `prod`), all changes made to `fetch-by-code.ts` and `post-login-add-metadata.ts` (or services used in those files) in your local copy of the project will not be available to your frontend.

This is problematic when adding new data to the user's profile and you need others to test the feature in your pull request. Since Auth0 will not use your PR's URL to obtain the data, the profile data will come from the dev environment.

To make Auth0 call your pull request's URL instead of the default `dev` environment, you will need to create a passing CI pull request with the following GitHub labels:

- `crn-create-environment`
- `use-pr-auth0-tenant`

When doing this, your branch will be deployed with a custom Auth0 setting that will make the authentication service use your PR's URL to retrieve the user's data.

## Caveats

Although these instructions address the problem of doing QA in your feature branch, they do not provide the ability to test your changes locally. You will have to test your feature against local mocks or fixtures when running the system in your local environment.

## Reference PRs

Here is a list of PRs that used this mechanism.

- https://github.com/yldio/asap-hub/pull/4836 (addition of `Projects` to user's profile)
- https://github.com/yldio/asap-hub/pull/4416/changes (just testing the mechanism)
