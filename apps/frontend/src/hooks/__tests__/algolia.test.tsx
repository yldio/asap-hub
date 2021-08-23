import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch/lite';
import { ALGOLIA_APP_ID, ALGOLIA_INDEX } from '@asap-hub/frontend/src/config';
import { renderHook } from '@testing-library/react-hooks';
import { RecoilRoot } from 'recoil';

import { useAlgolia } from '../algolia';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

var mockInitIndex: jest.MockedFunction<SearchClient['initIndex']>;

jest.mock('algoliasearch/lite', () => {
  mockInitIndex = jest.fn();
  mockInitIndex.mockImplementation(() => ({} as SearchIndex));
  return jest.fn().mockImplementation(() => ({
    initIndex: mockInitIndex,
  }));
});
const mockAlgoliasearch = algoliasearch as jest.MockedFunction<
  typeof algoliasearch
>;

describe('useAlgolia', () => {
  it('throws when user is not provided', () => {
    const { result } = renderHook(() => useAlgolia());
    expect(result.error).toEqual(
      new Error('Algolia unavailable while not logged in'),
    );
  });
  it('constructs algolia client', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAlgolia(), {
      wrapper: ({ children }) => (
        <RecoilRoot>
          <Auth0Provider user={{ algoliaApiKey: 'algolia key' }}>
            <WhenReady>{children}</WhenReady>
          </Auth0Provider>
        </RecoilRoot>
      ),
    });
    await waitForNextUpdate();
    expect(mockInitIndex).toHaveBeenCalledWith(ALGOLIA_INDEX);
    expect(mockAlgoliasearch).toHaveBeenCalledWith(
      ALGOLIA_APP_ID,
      'algolia key',
    );
    expect(result.current.client).toBeDefined();
    expect(result.current.index).toBeDefined();
  });
});
