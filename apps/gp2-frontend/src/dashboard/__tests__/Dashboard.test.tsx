import { User } from '@asap-hub/auth';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getDashboard } from '../api';
import Dashboard from '../Dashboard';
import { refreshDashboardState } from '../state';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});
const mockGetDashboard = getDashboard as jest.MockedFunction<
  typeof getDashboard
>;

const renderDashboard = async (user: Partial<User>) => {
  render(
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
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
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
        title: 'Tutorial Title',
        type: 'Tutorial',
      },
    ],
    pages: [],
  });

  await renderDashboard({
    firstName: 'John',
  });

  expect(await screen.findByText(/john/i, { selector: 'h1' })).toBeVisible();
  expect(screen.getAllByText(/title/i, { selector: 'h4' }).length).toBe(2);
});
