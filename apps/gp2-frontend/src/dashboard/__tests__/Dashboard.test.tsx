import { User } from '@asap-hub/auth';
import { gp2 } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getDashboardStats, getNews } from '../api';
import { getAlgoliaEvents } from '../../events/api';
import Dashboard from '../Dashboard';
import {
  createEventListAlgoliaResponse,
  createUserListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getAlgoliaUsers } from '../../users/api';

jest.mock('../api');
jest.mock('../../events/api');
jest.mock('../../users/api');

afterEach(() => {
  jest.resetAllMocks();
});

const renderDashboard = async ({ user = {} }: { user?: Partial<User> }) => {
  render(
    <Suspense fallback="loading">
      <RecoilRoot>
        <Auth0Provider user={{ ...user, role: 'Network Collaborator' }}>
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
const mockGetNews = getNews as jest.MockedFunction<typeof getNews>;
const mockGetEvents = getAlgoliaEvents as jest.MockedFunction<
  typeof getAlgoliaEvents
>;
const mockDashboard = getDashboardStats as jest.MockedFunction<
  typeof getDashboardStats
>;
const mockGetUsers = getAlgoliaUsers as jest.MockedFunction<
  typeof getAlgoliaUsers
>;
it('renders dashboard header', async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(createEventListAlgoliaResponse(1));
  mockDashboard.mockResolvedValueOnce(gp2.createDashboardStatsResponse());
  mockGetUsers.mockResolvedValueOnce(createUserListAlgoliaResponse(3));
  await renderDashboard({});
  expect(
    await screen.getByRole('heading', { name: 'Dashboard' }),
  ).toBeVisible();
});

it('doesnt render the welcome back banner when its disabled', async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(createEventListAlgoliaResponse(1));
  mockDashboard.mockResolvedValueOnce(gp2.createDashboardStatsResponse());
  mockGetUsers.mockResolvedValueOnce(createUserListAlgoliaResponse(3));
  await renderDashboard({
    user: { firstName: 'Tony' },
  });
  expect(
    screen.queryByText('Welcome back to the GP2 Hub, Tony!'),
  ).not.toBeInTheDocument();
});

it('renders the news when theres at least one news', async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(createEventListAlgoliaResponse(1));
  mockDashboard.mockResolvedValueOnce(gp2.createDashboardStatsResponse());
  mockGetUsers.mockResolvedValueOnce(createUserListAlgoliaResponse(3));
  await renderDashboard({});
  expect(screen.getByRole('heading', { name: 'Latest News' })).toBeVisible();
});

it("renders the upcoming events with events when there's at least one upcoming event", async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(createEventListAlgoliaResponse(1));
  mockDashboard.mockResolvedValueOnce(gp2.createDashboardStatsResponse());
  mockGetUsers.mockResolvedValueOnce(createUserListAlgoliaResponse(3));
  await renderDashboard({});
  expect(
    screen.getByRole('heading', { name: 'Upcoming Events' }),
  ).toBeVisible();
});
