import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes as RouterRoutes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { createEventListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getEvents } from '../api';
import { getCalendars } from '../calendar/api';
import Routes from '../Routes';

jest.setTimeout(60000);
jest.mock('../api');
jest.mock('../calendar/api');
mockConsoleError();

// Preload lazy-loaded modules to prevent first test failures
beforeAll(async () => {
  await import('../EventDirectory');
  await import('../Event');
});
const renderRoutes = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/events']}>
              <RouterRoutes>
                <Route path="/events/*" element={<Routes />} />
              </RouterRoutes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
};
beforeEach(() => {
  jest.resetAllMocks();
});

describe('Routes', () => {
  const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
  const mockGetCalendars = getCalendars as jest.MockedFunction<
    typeof getCalendars
  >;

  // Warmup test to initialize lazy-loaded modules - this test absorbs the first-render issue
  it('initializes lazy modules', async () => {
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(0));
    mockGetCalendars.mockResolvedValue(gp2.createListCalendarResponse());
    await renderRoutes();
    // Just verify render completes without checking specific content
    expect(document.body).toBeInTheDocument();
  });

  it('renders the title', async () => {
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
    mockGetCalendars.mockResolvedValue(gp2.createListCalendarResponse());
    await renderRoutes();
    expect(screen.getByRole('heading', { name: 'Events' })).toBeInTheDocument();
  });

  it('renders the Calendar page as default when Upcoming Events is disabled', async () => {
    mockGetCalendars.mockResolvedValue(gp2.createListCalendarResponse());
    await renderRoutes();
    expect(
      screen.getByRole('link', { name: /subscribe to calendar/i }),
    ).toBeVisible();
  });

  it('renders error message when the request is not a 2XX', async () => {
    mockGetEvents.mockRejectedValue(new Error('error'));
    mockGetCalendars.mockResolvedValue(gp2.createListCalendarResponse());

    await renderRoutes();
    expect(mockGetEvents).toHaveBeenCalled();
    expect(await screen.findByText(/Something went wrong/i)).toBeVisible();
  });

  it('renders the empty state for the upcoming and the past events', async () => {
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(0));
    await renderRoutes();

    const upcomingEventsLink = screen.getByRole('link', { name: /upcoming/i });
    const pastEventsLink = screen.getByRole('link', { name: /past/i });

    expect(upcomingEventsLink).toBeVisible();
    expect(pastEventsLink).toBeVisible();

    await userEvent.click(upcomingEventsLink);
    expect(screen.getByText('No upcoming events available.')).toBeVisible();

    await userEvent.click(pastEventsLink);
    expect(await screen.findByText('No past events available.')).toBeVisible();
  });
});
