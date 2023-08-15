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

describe('Algolia Search Client', () => {
  beforeEach(jest.resetAllMocks);
  beforeEach(() => {
    algoliasearchMock.mockReturnValue(algoliaSearchClientMock);
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

  test('Should instantiate the No Token Search Client', () => {
    algoliaSearchClientFactory({
      algoliaApiKey: null,
      algoliaAppId: 'test-app-id',
      algoliaIndex: 'test-index',
    });

    expect(algoliasearchMock).not.toBeCalled();
    expect(algoliaSearchClientMock.initIndex).not.toBeCalled();
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
  test('Should instantiate the dummy token native client', () => {
    expect(() => {
      algoliaSearchClientNativeFactory({
        algoliaApiKey: null,
        algoliaAppId: 'native-test-app-id',
      });
    }).toThrow('Algolia API key is not set');
  });
});
