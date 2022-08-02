import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { createListCalendarResponse } from '@asap-hub/fixtures';
import { events } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getEvents } from '../api';
import { getCalendars } from '../calendar/api';
import { refreshCalendarsState } from '../calendar/state';
import Events from '../Events';
import { getEventListOptions } from '../options';
import { eventsState } from '../state';

jest.useFakeTimers('modern');

jest.mock('../calendar/api');
jest.mock('../api');

const mockGetCalendars = getCalendars as jest.MockedFunction<
  typeof getCalendars
>;
const mockGetEventsFromAlgolia = getEvents as jest.MockedFunction<
  typeof getEvents
>;

const renderEventsPage = async (pathname = events({}).$) => {
  const result = render(
    <RecoilRoot
      initializeState={({ set, reset }) => {
        set(refreshCalendarsState, Math.random());
        reset(eventsState(getEventListOptions(new Date(), { past: false })));
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname }]}>
              <Route path={events.template}>
                <Events />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
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
    eventProperty | route                        | expected
    ${'after'}    | ${events({}).past({}).$}     | ${'past'}
    ${'before'}   | ${events({}).upcoming({}).$} | ${'upcoming'}
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
      await renderEventsPage(events({}).calendar({}).$);
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
      await renderEventsPage(events({}).calendar({}).$);
      expect(screen.getByText(/calendar title 0/i)).toBeVisible();
      expect(screen.getByText(/calendar title 1/i)).toBeVisible();
    });
  });
});
