import algoliasearch, { SearchClient } from 'algoliasearch';
import { algoliaSearchClientFactory } from '../src';
import * as config from '../src/config';

jest.mock('algoliasearch');

const algoliasearchMock = algoliasearch as jest.MockedFunction<
  typeof algoliasearch
>;
const algoliaSearchClientMock = {
  initIndex: jest.fn(),
} as unknown as jest.Mocked<SearchClient>;
algoliasearchMock.mockReturnValue(algoliaSearchClientMock);

describe('Algolia Search Client Factory', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should instantiate with defaults', () => {
    algoliaSearchClientFactory();

    expect(algoliasearchMock).toBeCalledWith(
      config.algoliaAppId,
      config.algoliaApiKey,
    );
    expect(algoliaSearchClientMock.initIndex).toBeCalledWith(
      config.algoliaIndex,
    );
  });

  test('Should instantiate with a custom api key and index', () => {
    algoliaSearchClientFactory({
      algoliaApiKey: 'test-key',
      algoliaAppId: 'test-app-id',
      algoliaIndex: 'test-index',
    });

    expect(algoliasearchMock).toBeCalledWith('test-app-id', 'test-key');
    expect(algoliaSearchClientMock.initIndex).toBeCalledWith('test-index');
  });
});
