import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 } from '@asap-hub/fixtures';
import { useFlags } from '@asap-hub/react-context';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
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
const renderRoutes = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/events']}>
              <Route path="/events">
                <Routes />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
beforeEach(() => {
  jest.resetAllMocks();
});

describe('Routes', () => {
  const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
  const mockGetCalendars = getCalendars as jest.MockedFunction<
    typeof getCalendars
  >;
  it('renders the title', async () => {
    const {
      result: { current },
    } = renderHook(useFlags);
    current.enable('DISPLAY_EVENTS');
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
    await renderRoutes();
    expect(screen.getByRole('heading', { name: 'Events' })).toBeInTheDocument();
  });

  it('renders the Calendar page as default when Upcoming Events is disabled', async () => {
    const {
      result: { current },
    } = renderHook(useFlags);
    current.disable('DISPLAY_EVENTS');
    mockGetCalendars.mockResolvedValue(gp2.createListCalendarResponse());
    await renderRoutes();
    expect(
      screen.getByRole('link', { name: /subscribe to calendar/i }),
    ).toBeVisible();
  });

  it('renders error message when the request is not a 2XX', async () => {
    const {
      result: { current },
    } = renderHook(useFlags);
    current.enable('DISPLAY_EVENTS');
    mockGetEvents.mockRejectedValueOnce(new Error('error'));

    await renderRoutes();
    expect(mockGetEvents).toHaveBeenCalled();
    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });

  it('renders the empty state for the upcoming and the past events', async () => {
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(0));
    await renderRoutes();

    const upcomingEventsLink = screen.getByRole('link', { name: /upcoming/i });
    const pastEventsLink = screen.getByRole('link', { name: /past/i });

    expect(upcomingEventsLink).toBeVisible();
    expect(pastEventsLink).toBeVisible();

    userEvent.click(upcomingEventsLink);
    expect(screen.getByText('No upcoming events available.')).toBeVisible();

    userEvent.click(pastEventsLink);
    expect(await screen.findByText('No past events available.')).toBeVisible();
  });
});
