# Auth0 add user metadata rule

> Adds user metadata to the idToken on successful login

See [Auth0 docs](../../docs/config/auth0) for how this rule is supposed to be used.

Note: We can only use a single index file and only deps that are [supported in the Auth0 environment](https://auth0-extensions.github.io/canirequire/) here. If we want to go beyond that, we'll need a bundle step for this script.
