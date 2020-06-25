/* istanbul ignore file */

const {
  GLOBAL_TOKEN,
  APP_ORIGIN,
  MONGODB_CONNECTION_STRING,
  NODE_ENV,
} = process.env;

export const globalToken = GLOBAL_TOKEN || 'change_me_when_we_have_admins';
export const mongoDbConnectionString =
  MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/asap';
export const origin = APP_ORIGIN || 'http://localhost:3000';
export const sesEndpoint =
  NODE_ENV !== 'production' ? 'http://localhost:4566' : undefined;
