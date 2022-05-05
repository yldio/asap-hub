const config: typeof import('../config') = {
  domain: 'auth.example.com',
  clientID: 'client_id',
};

const auth0PubKeys = jest.requireActual('../pubKeys').default;

export { config, auth0PubKeys };
