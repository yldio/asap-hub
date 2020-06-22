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
- `Allowed Callback URLs` - `http://localhost:3000, https://$PRODUCTION_HOST`
- `Allowed Web Origins` - `http://localhost:3000, https://$PRODUCTION_HOST`

**Connections**

- `Username-Password-Authentication` - `true`
- `google-oauth2` - `true`

## Auth0 Universal Login

**Settings**

- `Company Logo` - URL to the ASAP logo
- `Primary Color` - pick any matching branding
- `Background Color` - pick any matching branding

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

Create a connection for ORCID and configure as follows:

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
