# Auth0 setup

This is a documentation of the Auth0 and identity provider configuration that the ASAP hub uses.
The aim is to make the configuration reproducible based on the content in here, instead of hidden in someone's Auth0 account.
This document is targeted at developers and does _not_ aim to explain OAuth 2, OIDC, or Auth0. For a guide about those, please refer to e.g. Auth0 documentation.

## Auth0 frontend application

An Auth0 application for the Hub frontend needs to be created
and configured as follows:

**Settings**

- `domain` - pick any and copy to the frontend auth config
- `Client ID` - generated, copy to the frontend auth config
- `Application Type` - Single Page Application
- `Allowed Callback URLs` - `http://localhost:3000, https://$PRODUCTION_HOST, https://*.$PRODUCTION_HOST`
- `Allowed Logout URLs` - `http://localhost:3000, https://$PRODUCTION_HOST, https://*.$PRODUCTION_HOST`
- `Allowed Web Origins` - `http://localhost:3000, https://$PRODUCTION_HOST, https://*.$PRODUCTION_HOST`

**Connections**

- `Username-Password-Authentication` - `true`
- `google-oauth2` - `true`

## Auth0 Universal Login

**Settings**

- `Primary Color` - hex value of `fern` from our design guidelines

**Login**

- `Customize Login Page` - `true`
- `HTML` - [build output index.html](../../apps/auth-frontend/build/index.html) of `@asap-hub/auth-frontend`

## ORCID application

In account developer tools, create an application for the Hub and configure as follows:

- `Your website URL` - `$PRODUCTION_HOST`
- `Description of your application` - `The Hub by ASAP: Aligning Science Across Parkinson's`
- `Redirect URIs` - `https://$AUTH0_HOST/login/callback`

## Auth0 Extensions

**Installed Extensions**

- `Custom Social Connections`

## Auth0 Custom Social Connections

Create a connection named `ORCID` and configure as follows:

**Settings**

- `Client ID` - from ORCID application (see other section)
- `Client Secret` - from ORCID application (see other section)
- `Authorization URL` - from ORCID application: "Authorize request > endpoint"
- `Token URL` - from ORCID application: "Token request > endpoint"
- `Scope` - `openid`
- `Fetch User Profile Script` -
  ```js
  function() {
    $ORCID_USER_PROFILE_SCRIPT
    exports.default(...arguments);
  }
  ```
  Where `$ORCID_USER_PROFILE_SCRIPT` is the [build output](../../apps/orcid-user-profile-script/build/index.js) of `@asap-hub/orcid-user-profile-script`.

**Apps**

Enable for all

## Auth0 Connect User Rule

Create a new rule and configure as follows:

**Settings**

- `APP_ORIGIN`: The API's endpoint base URL (including `https://`)
- `API_SHARED_SECRET`: The same secret defined on the CI that is injected to the API

**Script**

```js
function() {
  $CONNECT_USER_PROFILE
  exports.default(...arguments);
}
```
Where `$CONNECT_USER_PROFILE` is the [build output](../../apps/auth0-connect-user/build/index.js) of `@asap-hub/auth0-connect-user`.

## Auth0 Add User Metadata

Create a new rule and configure as follows:

**Settings**

- `APP_ORIGIN`: The API's endpoint base URL (including `https://`)
- `API_SHARED_SECRET`: The same secret defined on the CI that is injected to the API

**Script**

```js
function() {
  $ADD_USER_METADATA
  exports.default(...arguments);
}
```
Where `$ADD_USER_METADATA` is the [build output](../../apps/auth0-add-user-metadata/build/index.js) of `@asap-hub/auth0-add-user-metadata`.
