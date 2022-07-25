import { SquidexGraphqlClient } from '@asap-hub/squidex';

export const getSquidexGraphqlClientMock =
  (): jest.Mocked<SquidexGraphqlClient> => ({
    request: jest.fn(),
  });
