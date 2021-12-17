import { Client, ManagementClient } from 'auth0';
import { clientID, domain, apiToken } from '../config';

export type JWTConfiguration = {
  lifetimeInSeconds: number;
};

const getManagemntClient = (): ManagementClient =>
  new ManagementClient({
    token: apiToken,
    domain,
  });

const getClient = (): Promise<Client> =>
  getManagemntClient().getClient({ client_id: clientID });

export const getJWTConfiguration = async (): Promise<
  JWTConfiguration | undefined
> => {
  const client = await getClient();

  if (client?.jwt_configuration?.lifetime_in_seconds) {
    return {
      lifetimeInSeconds: client.jwt_configuration.lifetime_in_seconds,
    };
  }

  return undefined;
};
