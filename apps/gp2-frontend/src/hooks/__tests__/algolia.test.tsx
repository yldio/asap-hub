import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { renderHook } from '@testing-library/react-hooks';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { ALGOLIA_APP_ID, ALGOLIA_INDEX } from '../../config';
import { useAlgolia } from '../algolia';

jest.mock('@asap-hub/algolia', () => ({
  ...jest.requireActual('@asap-hub/algolia'),
  algoliaSearchClientFactory: jest
    .fn()
    .mockReturnValue({} as AlgoliaSearchClient<'gp2'>),
}));

beforeEach(() => {
  Object.defineProperty(window, 'dataLayer', {
    configurable: true,
    value: [],
  });
});
afterEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (window as any).dataLayer;
});

describe('useAlgolia', () => {
  it('throws when user is not provided', () => {
    const { result } = renderHook(() => useAlgolia());
    expect(result.error).toEqual(
      new Error('Algolia unavailable while not logged in'),
    );
  });
  it('constructs algolia client linking GTM and Algolia with Auth0 user id', async () => {
    const mockAlgoliaSearchClientFactory =
      algoliaSearchClientFactory as jest.MockedFunction<
        typeof algoliaSearchClientFactory
      >;
    const { result, waitForNextUpdate } = renderHook(() => useAlgolia(), {
      wrapper: ({ children }) => (
        <RecoilRoot>
          <Auth0Provider
            user={{ algoliaApiKey: 'algolia key', id: 'usertoken' }}
          >
            <WhenReady>{children}</WhenReady>
          </Auth0Provider>
        </RecoilRoot>
      ),
    });
    await waitForNextUpdate();

    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        {
          algoliaUserToken: 'usertoken',
        },
      ]),
    );
    expect(mockAlgoliaSearchClientFactory).toHaveBeenCalledWith({
      algoliaIndex: ALGOLIA_INDEX,
      algoliaAppId: ALGOLIA_APP_ID,
      algoliaApiKey: 'algolia key',
      clickAnalytics: true,
      userToken: 'usertoken',
    });
    expect(result.current.client).toBeDefined();
  });
});
