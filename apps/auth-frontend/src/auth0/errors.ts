import { Auth0Error } from 'auth0-js';

// Auth0 API has very inconsistent error formats
export const extractErrorMessage = (error: Auth0Error | Error) =>
  ('error_description' in error && error.error_description) ||
  ('errorDescription' in error && error.errorDescription) ||
  ('description' in error && error.description) ||
  ('message' in error && `Unknown authentication error: ${error.message}`) ||
  `Unknown authentication error: ${error.name}`;
