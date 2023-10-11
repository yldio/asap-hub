import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import {
  render,
  waitForElementToBeRemoved,
  screen,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { createListGuidesResponse } from '@asap-hub/fixtures';

import Guides from '../Guides';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getGuides } from '../../guides/api';
import { refreshDiscoverState } from '../../about/state';

jest.mock('../../guides/api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetGuides = getGuides as jest.MockedFunction<typeof getGuides>;

const renderGuides = async (user: Partial<User>) => {
  render(
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ set }) => {
          set(refreshDiscoverState, Math.random());
        }}
      >
        <Auth0Provider user={user}>
          <WhenReady>
            <Guides />
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </Suspense>,
  );

  await waitForElementToBeRemoved(screen.queryByText(/loading/i));
};

it('renders guides', async () => {
  const guidesResponse = createListGuidesResponse(1);
  mockGetGuides.mockResolvedValue({
    ...guidesResponse,
    items: guidesResponse.items.map((guide) => ({
      ...guide,
      title: 'Guide Title 1',
    })),
  });

  await renderGuides({});
  expect(screen.getByText(/Guides/i, { selector: 'h2' })).toBeVisible();
  expect(screen.getByText(/Guide Title 1/i, { selector: 'h5' })).toBeVisible();
});
