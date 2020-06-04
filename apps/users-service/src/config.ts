/* istanbul ignore file */

const {
  APP_BASE_URL,
  AUTH0_BASE_URL,
  MONGODB_CONNECTION_STRING,
  NODE_ENV,
} = process.env;

export const auth0BaseUrl = AUTH0_BASE_URL || 'https://jeysal.eu.auth0.com';
export const globalToken = 'change_me_when_we_have_admins';
export const mongoDbConnectionString =
  MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/asap';
export const origin = APP_BASE_URL || 'http://localhost:3000';
export const sesEndpoint =
  NODE_ENV !== 'production' ? 'http://localhost:4566' : undefined;
