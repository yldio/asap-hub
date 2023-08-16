# Deployment

To deploy actions and the login page html you will need to provide the CI Application's AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET and AUTH0_DOMAIN and run the following command:

`AUTH0_CLIENT_ID=XXXX AUTH0_CLIENT_SECRET=XXXX AUTH0_DOMAIN=XXXX yarn deploy`

i.e. For GP2:

`APPLICATION_NAME=gp2 API_URL=https://api-dev.gp2.asap.science AUTH0_CLIENT_ID=o6NEEPm9WVKt1aqRr25tbFDlAV8WQVnR AUTH0_CLIENT_SECRET=XXXX AUTH0_DOMAIN=dev-gp2-hub.us.auth0.com BASE_PR_APP_DOMAIN=gp2.asap.science AUTH0_ADDITIONAL_CLAIM_DOMAIN=https://dev.gp2.asap.science AUTH0_SHARED_SECRET=XXXX yarn deploy`

# Auth0 Connect User Action

> Connects user's auth0 profile to an ASAP user using invitationCode.

# Auth0 Add User Metadata

> Add User metadata to the idToken on successful login.

See [Auth0 docs](../../docs/config/auth0.md) for how this role is supposed to be used.

Note: We can only use a single index file and only deps that are [supported in the Auth0 environment](https://auth0-extensions.github.io/canirequire/) here. If we want to go beyond that, we'll need a bundle step for this script.
