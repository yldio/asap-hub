import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { createDiscoverResponse, createNewsResponse } from '@asap-hub/fixtures';

import Tutorials from '../Tutorials';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { refreshDiscoverState } from '../state';
import { getDiscover } from '../api';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetDiscover = getDiscover as jest.MockedFunction<typeof getDiscover>;

const renderDiscoverTutorials = async (user: Partial<User>) => {
  const result = render(
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ set }) => {
          set(refreshDiscoverState, Math.random());
        }}
      >
        <Auth0Provider user={user}>
          <WhenReady>
            <Tutorials />
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </Suspense>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders tutorial page with two items', async () => {
  mockGetDiscover.mockResolvedValue({
    ...createDiscoverResponse(),
    training: [
      createNewsResponse({ key: 'First One', type: 'Tutorial' }),
      createNewsResponse({ key: 'Second One', type: 'Tutorial' }),
    ],
  });

  await renderDiscoverTutorials({});
  expect(
    screen
      .getAllByRole('heading', { level: 4 })
      .map(({ textContent }) => textContent),
  ).toEqual(['Tutorial First One title', 'Tutorial Second One title']);
});

it('renders the correct title and subtitle', async () => {
  await renderDiscoverTutorials({});

  expect(screen.getByText(/Tutorials/i, { selector: 'h2' })).toBeVisible();
  expect(screen.getByText(/Explore our tutorials/i)).toBeVisible();
});
