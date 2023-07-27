import { AlgoliaSearchClient, gp2 } from '@asap-hub/algolia';

export const algoliaSearchClientMock = {
  save: jest.fn(),
  saveMany: jest.fn(),
  remove: jest.fn(),
  search: jest.fn(),
} as unknown as jest.Mocked<
  AlgoliaSearchClient<gp2.EntityResponses, gp2.Payload>
>;
