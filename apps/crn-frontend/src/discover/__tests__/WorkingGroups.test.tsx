import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { createDiscoverResponse, createNewsResponse } from '@asap-hub/fixtures';

import WorkingGroups from '../WorkingGroups';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { refreshDiscoverState } from '../state';
import { getDiscover } from '../api';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetDiscover = getDiscover as jest.MockedFunction<typeof getDiscover>;

const renderDiscoverWorkingGroups = async (user: Partial<User>) => {
  const result = render(
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ set }) => {
          set(refreshDiscoverState, Math.random());
        }}
      >
        <Auth0Provider user={user}>
          <WhenReady>
            <WorkingGroups />
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

it('renders working group page with two items', async () => {
  mockGetDiscover.mockResolvedValue({
    ...createDiscoverResponse(),
    workingGroups: [
      createNewsResponse('First One', 'Working Groups'),
      createNewsResponse('Second One', 'Working Groups'),
    ],
  });

  await renderDiscoverWorkingGroups({});
  expect(
    screen
      .getAllByRole('heading', { level: 4 })
      .map(({ textContent }) => textContent),
  ).toEqual([
    'Working Groups First One title',
    'Working Groups Second One title',
  ]);
});

it('renders the correct title and subtitle', async () => {
  mockGetDiscover.mockResolvedValue({
    ...createDiscoverResponse(),
    workingGroups: [
      createNewsResponse('First One', 'Working Groups'),
      createNewsResponse('Second One', 'Working Groups'),
    ],
  });

  await renderDiscoverWorkingGroups({});
  expect(screen.getByText(/Working Groups/i, { selector: 'h2' })).toBeVisible();
  expect(screen.getByText(/Explore our Working Groups/i)).toBeVisible();
});
