import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { renderHook, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { ALGOLIA_APP_ID, ALGOLIA_INDEX } from '../../config';
import { useAlgolia } from '../algolia';

jest.mock('@asap-hub/algolia', () => ({
  ...jest.requireActual('@asap-hub/algolia'),
  algoliaSearchClientFactory: jest
    .fn()
    .mockReturnValue({} as AlgoliaSearchClient<'crn'>),
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
  jest.restoreAllMocks();
});

describe('useAlgolia', () => {
  it('throws when user is not provided', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => renderHook(() => useAlgolia())).toThrow(
      new Error('Algolia unavailable while not logged in'),
    );

    consoleErrorSpy.mockRestore();
  });
  it('constructs an algolia client with a junk key', async () => {
    const mockAlgoliaSearchClientFactory =
      algoliaSearchClientFactory as jest.MockedFunction<
        typeof algoliaSearchClientFactory
      >;
    renderHook(() => useAlgolia(), {
      wrapper: ({ children }) => (
        <RecoilRoot>
          <Auth0Provider user={{ algoliaApiKey: null, id: 'usertoken' }}>
            <WhenReady>{children}</WhenReady>
          </Auth0Provider>
        </RecoilRoot>
      ),
    });

    await waitFor(() => {
      expect(mockAlgoliaSearchClientFactory).toHaveBeenCalledWith({
        algoliaIndex: ALGOLIA_INDEX,
        algoliaAppId: ALGOLIA_APP_ID,
        algoliaApiKey: null,
        clickAnalytics: true,
        userToken: 'usertoken',
      });
    });
  });
  it('constructs algolia client linking GTM and Algolia with Auth0 user id', async () => {
    const mockAlgoliaSearchClientFactory =
      algoliaSearchClientFactory as jest.MockedFunction<
        typeof algoliaSearchClientFactory
      >;

    const { result } = renderHook(() => useAlgolia(), {
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

    await waitFor(() => {
      expect(mockAlgoliaSearchClientFactory).toHaveBeenCalledWith({
        algoliaIndex: ALGOLIA_INDEX,
        algoliaAppId: ALGOLIA_APP_ID,
        algoliaApiKey: 'algolia key',
        clickAnalytics: true,
        userToken: 'usertoken',
      });
    });

    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        {
          algoliaUserToken: 'usertoken',
        },
      ]),
    );
    expect(result.current.client).toBeDefined();
  });
});
