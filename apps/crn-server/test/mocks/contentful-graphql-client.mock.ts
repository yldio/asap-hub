import { GraphQLClient } from '@asap-hub/contentful';

export const getContentfulGraphqlClientMock = (): jest.Mocked<GraphQLClient> =>
  ({
    request: jest.fn(),
  } as any as jest.Mocked<GraphQLClient>);
