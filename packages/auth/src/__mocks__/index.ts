const config: typeof import('../config') = {
  domain: 'auth.example.com',
  clientID: 'client_id',
  apiToken: 'api_token',
  currentTimestampHeader: 'timestamp-header'.toLocaleLowerCase()
};

const auth0PubKeys = jest.requireActual('../pubKeys').default;
export { config, auth0PubKeys };
