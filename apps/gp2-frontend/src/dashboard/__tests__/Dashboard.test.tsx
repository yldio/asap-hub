import { User } from '@asap-hub/auth';
import { gp2 } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getNews } from '../api';
import { getEvents } from '../../events/api';
import Dashboard from '../Dashboard';
import { refreshNewsState } from '../state';

jest.mock('../api');
jest.mock('../../events/api');

afterEach(() => {
  jest.resetAllMocks();
});
const currentTime = new Date();
const renderDashboard = async ({
  user = {},
  showWelcomeBackBanner = false,
  dismissBanner = jest.fn(),
}: {
  user?: Partial<User>;
  showWelcomeBackBanner?: boolean;
  dismissBanner?: () => void;
}) => {
  render(
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ set }) => {
          set(refreshNewsState, Math.random());
        }}
      >
        <Auth0Provider user={{ ...user, role: 'Network Collaborator' }}>
          <WhenReady>
            <Dashboard
              {...{ showWelcomeBackBanner, dismissBanner, currentTime }}
            />
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
it('renders dashboard header', async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(gp2.createListEventResponse(1));
  await renderDashboard({});
  expect(
    await screen.getByRole('heading', { name: 'Dashboard' }),
  ).toBeVisible();
});

it('doesnt render the welcome back banner when its disabled', async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(gp2.createListEventResponse(1));
  await renderDashboard({
    user: { firstName: 'Tony' },
    showWelcomeBackBanner: false,
  });
  expect(
    screen.queryByText('Welcome back to the GP2 Hub, Tony!'),
  ).not.toBeInTheDocument();
});

it('renders the welcome back banner when its enabled', async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(gp2.createListEventResponse(1));
  await renderDashboard({
    user: { firstName: 'Tony' },
    showWelcomeBackBanner: true,
  });
  expect(screen.getByText('Welcome back to the GP2 Hub, Tony!')).toBeVisible();
});

it('calls the dismissBanner function when pressing the close button on the welcome back banner', async () => {
  const dismissBanner = jest.fn();
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(gp2.createListEventResponse(1));
  await renderDashboard({
    user: { firstName: 'Tony' },
    showWelcomeBackBanner: true,
    dismissBanner,
  });
  userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(dismissBanner).toHaveBeenCalled();
});

it('renders the news when theres at least one news', async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(gp2.createListEventResponse(1));
  await renderDashboard({});
  expect(
    screen.getByRole('heading', { name: 'News and Updates' }),
  ).toBeVisible();
});

it("renders the upcoming events with events when there's at least one upcoming event", async () => {
  mockGetNews.mockResolvedValueOnce(gp2.createNewsResponse());
  mockGetEvents.mockResolvedValueOnce(gp2.createListEventResponse(1));
  await renderDashboard({});
  expect(
    screen.getByRole('heading', { name: 'Upcoming Events' }),
  ).toBeVisible();
});
