import { createListCalendarResponse } from '@asap-hub/fixtures';
import { getEventListOptions } from '@asap-hub/frontend-utils';
import { eventRoutes } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getEvents } from '../api';
import { getCalendars } from '../calendar/api';
import { refreshCalendarsState } from '../calendar/state';
import Events from '../Events';

import { eventsState } from '../state';

jest.mock('../calendar/api');
jest.mock('../api');

const mockGetCalendars = getCalendars as jest.MockedFunction<
  typeof getCalendars
>;
const mockGetEventsFromAlgolia = getEvents as jest.MockedFunction<
  typeof getEvents
>;

const renderEventsPage = async (
  pathname: string = eventRoutes.DEFAULT.path,
) => {
  const result = render(
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ set, reset }) => {
          set(refreshCalendarsState, Math.random());
          reset(eventsState(getEventListOptions(new Date(), { past: false })));
        }}
      >
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[pathname]}>
              <Route path={eventRoutes.DEFAULT.path}>
                <Events />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </Suspense>,
  );
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Events', () => {
  it('Renders the events page header', async () => {
    mockGetCalendars.mockResolvedValue(createListCalendarResponse(0));
    await renderEventsPage();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toEqual(
      'Calendar and Events',
    );
  });

  describe.each`
    eventProperty | route                                | expected
    ${'after'}    | ${eventRoutes.DEFAULT.PAST.path}     | ${'past'}
    ${'before'}   | ${eventRoutes.DEFAULT.UPCOMING.path} | ${'upcoming'}
  `('the events $expected page', ({ eventProperty, route, expected }) => {
    it('can search for events', async () => {
      await renderEventsPage(route);
      userEvent.type(screen.getByRole('searchbox'), 'searchterm');
      await waitFor(() =>
        expect(mockGetEventsFromAlgolia).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.objectContaining({ searchQuery: 'searchterm' }),
        ),
      );
    });
  });

  describe('the events calendar page', () => {
    it('renders a google calendar iframe', async () => {
      mockGetCalendars.mockResolvedValue(createListCalendarResponse(0));
      await renderEventsPage(eventRoutes.DEFAULT.CALENDAR.path);
      const calendars = screen.getByTitle('Calendar');
      expect(calendars.tagName).toBe('IFRAME');
    });

    it('Displays a list of calendars', async () => {
      mockGetCalendars.mockResolvedValue({
        ...createListCalendarResponse(2),
        items: createListCalendarResponse(2).items.map((item, index) => ({
          ...item,
          name: `Calendar title ${index}`,
        })),
      });
      await renderEventsPage(eventRoutes.DEFAULT.CALENDAR.path);
      expect(screen.getByText(/calendar title 0/i)).toBeVisible();
      expect(screen.getByText(/calendar title 1/i)).toBeVisible();
    });
  });
});
