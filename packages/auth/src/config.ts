export const apiToken: string =
  process.env.AUTH0_API_TOKEN || 'auth0_api_token';
export const domain: string =
  process.env.AUTH0_DOMAIN || 'dev-asap-hub.us.auth0.com';
export const clientID: string =
  process.env.AUTH0_CLIENT_ID || 'xRDvgZe3Ql3LSZDs2dWQYzcohFnLyeL2';
export const currentTimestampHeader =
  'X-Auth0CurrentTimestamp'.toLocaleLowerCase();
