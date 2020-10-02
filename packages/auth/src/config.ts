import { URLSearchParams, URL } from 'url';

export const domain: string =
  process.env.AUTH0_DOMAIN || 'dev-asap-hub.us.auth0.com';
export const clientID: string =
  process.env.AUTH0_CLIENT_ID || 'xRDvgZe3Ql3LSZDs2dWQYzcohFnLyeL2';

export const hubUrl: string = new URL(
  new URLSearchParams(window.location.search).get('redirect_uri') ||
    'https://hub.asap.science/',
).origin;
