import { GraphQLClient } from '@asap-hub/contentful';

export const getContentfulGraphqlClientMock = (): jest.Mocked<
  Pick<
    GraphQLClient,
    | 'request'
    | 'batchRequests'
    | 'rawRequest'
    | 'setEndpoint'
    | 'setHeader'
    | 'setHeaders'
  >
> => ({
  request: jest.fn(),
  batchRequests: jest.fn(),
  rawRequest: jest.fn(),
  setEndpoint: jest.fn(),
  setHeader: jest.fn(),
  setHeaders: jest.fn(),
});
