import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import Dashboard from '../Dashboard';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { refreshDashboardState } from '../state';
import { getDashboard } from '../api';

jest.mock('../api');
jest.mock('../../events/api');
jest.mock('../../shared-research/api');
jest.mock('../../network/teams/api');

afterEach(() => {
  jest.clearAllMocks();
});
const mockGetDashboard = getDashboard as jest.MockedFunction<
  typeof getDashboard
>;

const renderDashboard = async (user: Partial<User>) => {
  const result = render(
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ set }) => {
          set(refreshDashboardState, Math.random());
        }}
      >
        <Auth0Provider user={user}>
          <WhenReady>
            <Dashboard />
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </Suspense>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
};

it('renders dashboard header', async () => {
  await renderDashboard({});
  expect(await screen.findByText(/welcome/i, { selector: 'h1' })).toBeVisible();
});

it('renders dashboard with news', async () => {
  mockGetDashboard.mockResolvedValue({
    news: [
      {
        id: '55724942-3408-4ad6-9a73-14b92226ffb6',
        created: '2020-09-07T17:36:54Z',
        title: 'News Title',
        type: 'News',
      },
      {
        id: '55724942-3408-4ad6-9a73-14b92226ffb77',
        created: '2020-09-07T17:36:54Z',
        title: 'Event Title',
        type: 'Event',
      },
    ],
    pages: [],
  });

  await renderDashboard({
    firstName: 'John',
  });
  expect(await screen.findByText(/john/i, { selector: 'h1' })).toBeVisible();
  expect(screen.queryAllByText(/title/i, { selector: 'h4' }).length).toBe(2);
});
