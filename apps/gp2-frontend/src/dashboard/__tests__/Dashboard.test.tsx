import { User } from '@asap-hub/auth';
import { gp2 } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getDashboardStats, getNews } from '../api';
import { getEvents } from '../../events/api';
import Dashboard from '../Dashboard';

jest.mock('../api');
jest.mock('../../events/api');

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
const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
const mockDashboard = getDashboardStats as jest.MockedFunction<
  typeof getDashboardStats
>;
it('renders dashboard header', async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(gp2.createListEventResponse(1));
  mockDashboard.mockResolvedValueOnce(gp2.createDashboardStatsResponse());
  await renderDashboard({});
  expect(
    await screen.getByRole('heading', { name: 'Dashboard' }),
  ).toBeVisible();
});

it('doesnt render the welcome back banner when its disabled', async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(gp2.createListEventResponse(1));
  mockDashboard.mockResolvedValueOnce(gp2.createDashboardStatsResponse());
  await renderDashboard({
    user: { firstName: 'Tony' },
  });
  expect(
    screen.queryByText('Welcome back to the GP2 Hub, Tony!'),
  ).not.toBeInTheDocument();
});

it('renders the news when theres at least one news', async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(gp2.createListEventResponse(1));
  mockDashboard.mockResolvedValueOnce(gp2.createDashboardStatsResponse());
  await renderDashboard({});
  expect(
    screen.getByRole('heading', { name: 'News and Updates' }),
  ).toBeVisible();
});

it("renders the upcoming events with events when there's at least one upcoming event", async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(gp2.createListEventResponse(1));
  mockDashboard.mockResolvedValueOnce(gp2.createDashboardStatsResponse());
  await renderDashboard({});
  expect(
    screen.getByRole('heading', { name: 'Upcoming Events' }),
  ).toBeVisible();
});
