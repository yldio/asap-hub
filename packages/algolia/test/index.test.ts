import algoliasearch, { SearchClient } from 'algoliasearch';
import {
  algoliaSearchClientFactory,
  algoliaSearchClientNativeFactory,
} from '../src';

jest.mock('algoliasearch');

const algoliasearchMock = algoliasearch as jest.MockedFunction<
  typeof algoliasearch
>;
const algoliaSearchClientMock = {
  initIndex: jest.fn(),
} as unknown as jest.Mocked<SearchClient>;
algoliasearchMock.mockReturnValue(algoliaSearchClientMock);

describe('Algolia Search Client', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should instantiate the Search Client', () => {
    algoliaSearchClientFactory({
      algoliaApiKey: 'test-key',
      algoliaAppId: 'test-app-id',
      algoliaIndex: 'test-index',
    });

    expect(algoliasearchMock).toBeCalledWith('test-app-id', 'test-key');
    expect(algoliaSearchClientMock.initIndex).toBeCalledWith('test-index');
    expect(algoliaSearchClientMock.initIndex).toBeCalledWith(
      'test-index-reverse-timestamp',
    );
  });

  test('Should instantiate the native client', () => {
    algoliaSearchClientNativeFactory({
      algoliaApiKey: 'native-test-key',
      algoliaAppId: 'native-test-app-id',
    });

    expect(algoliasearchMock).toBeCalledWith(
      'native-test-app-id',
      'native-test-key',
    );
  });
});
