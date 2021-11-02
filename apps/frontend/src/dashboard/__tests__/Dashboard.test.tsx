import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { disable } from '@asap-hub/flags';

import Dashboard from '../Dashboard';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getResearchOutputsLegacy } from '../../shared-research/api';
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

const mockGetResearchOutputsLegacy =
  getResearchOutputsLegacy as jest.MockedFunction<
    typeof getResearchOutputsLegacy
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
  return result;
};

it('renders dashboard header', async () => {
  const { findByText } = await renderDashboard({});
  expect(await findByText(/welcome/i, { selector: 'h1' })).toBeVisible();
});

it('renders dashboard with news and events', async () => {
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

  const { findByText, queryAllByText } = await renderDashboard({
    firstName: 'John',
  });

  expect(await findByText(/john/i, { selector: 'h1' })).toBeVisible();
  expect(queryAllByText(/title/i, { selector: 'h2' }).length).toBe(2);
});

it('prefetches research outputs (REGRESSION)', async () => {
  const { rerender } = await renderDashboard({});
  expect(mockGetResearchOutputsLegacy).not.toHaveBeenCalled();
  disable('ALGOLIA_RESEARCH_OUTPUTS');

  rerender(
    <Suspense fallback="loading">
      <RecoilRoot>
        <Auth0Provider user={{}}>
          <WhenReady>
            <Dashboard />
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </Suspense>,
  );
  await waitFor(() =>
    expect(mockGetResearchOutputsLegacy).toHaveBeenCalledTimes(1),
  );
});
