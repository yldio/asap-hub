import { createListCalendarResponse } from '@asap-hub/fixtures';
import { getEventListOptions } from '@asap-hub/frontend-utils';
import { events } from '@asap-hub/routing';
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

const renderEventsPage = async (pathname = events({}).$, search?: string) => {
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
            <MemoryRouter initialEntries={[{ pathname, search }]}>
              <Route path={events.template}>
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
    eventProperty | route                        | expected
    ${'after'}    | ${events({}).past({}).$}     | ${'past'}
    ${'before'}   | ${events({}).upcoming({}).$} | ${'upcoming'}
  `('the events $expected page', ({ eventProperty, route, expected }) => {
    it('does not render search box without searchQuery parameter', async () => {
      // Without searchQuery parameter, the search box should not render (prevents empty gap)
      await renderEventsPage(route);
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });

    it('can search for events', async () => {
      // Add searchQuery parameter with a space to ensure search box is rendered
      // (empty string is falsy and won't trigger the conditional render)
      await renderEventsPage(route, '?searchQuery= ');
      const searchBox = screen.getByRole('searchbox');
      // Select all existing text and replace it with new text
      userEvent.type(searchBox, '{selectall}searchterm');
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
