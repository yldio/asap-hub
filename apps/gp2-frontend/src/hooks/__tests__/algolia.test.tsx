import {
  ALGOLIA_APP_ID,
  ALGOLIA_INDEX,
} from '@asap-hub/gp2-frontend/src/config';
import { renderHook } from '@testing-library/react-hooks';
import { RecoilRoot } from 'recoil';
import { algoliaSearchClientFactory } from '@asap-hub/algolia';

import { useAlgolia } from '../algolia';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

var mockAlgoliaSearchClientFactory: jest.MockedFunction<
  typeof algoliaSearchClientFactory
>;

jest.mock('@asap-hub/algolia', () => {
  mockAlgoliaSearchClientFactory = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual('@asap-hub/algolia'),
    algoliaSearchClientFactory: mockAlgoliaSearchClientFactory,
  };
});

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
    expect(mockAlgoliaSearchClientFactory).toHaveBeenCalledWith({
      algoliaIndex: ALGOLIA_INDEX,
      algoliaAppId: ALGOLIA_APP_ID,
      algoliaApiKey: 'algolia key',
    });
    expect(result.current.client).toBeDefined();
  });
});
