import { createListCalendarResponse } from '@asap-hub/fixtures';
import { getEventListOptions } from '@asap-hub/frontend-utils';
import { events } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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

const renderEventsPage = (pathname = events({}).$, search?: string) =>
  render(
    <RecoilRoot
      initializeState={({ set, reset }) => {
        set(refreshCalendarsState, Math.random());
        reset(eventsState(getEventListOptions(new Date(), { past: false })));
      }}
    >
      <Auth0Provider user={{}}>
        <WhenReady>
          <MemoryRouter initialEntries={[{ pathname, search }]}>
            <Routes>
              <Route path={`${events.template}/*`} element={<Events />} />
            </Routes>
          </MemoryRouter>
        </WhenReady>
      </Auth0Provider>
    </RecoilRoot>,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Events', () => {
  it('Renders the events page header', async () => {
    mockGetCalendars.mockResolvedValue(createListCalendarResponse(0));
    renderEventsPage();

    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading.textContent).toEqual('Calendar and Events');
  });

  describe.each`
    eventProperty | route                        | expected
    ${'after'}    | ${events({}).past({}).$}     | ${'past'}
    ${'before'}   | ${events({}).upcoming({}).$} | ${'upcoming'}
  `('the events $expected page', ({ eventProperty, route, expected }) => {
    it('renders search box even without searchQuery parameter', async () => {
      // Search box is always visible for past/upcoming events pages
      renderEventsPage(route);

      const searchBox = await screen.findByRole('searchbox');
      expect(searchBox).toBeInTheDocument();
    });

    it('can search for events', async () => {
      renderEventsPage(route);

      const searchBox = await screen.findByRole('searchbox');
      // Select all existing text and replace it with new text
      await userEvent.type(searchBox, '{selectall}searchterm');

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
      renderEventsPage(events({}).calendar({}).$);

      const calendars = await screen.findByTitle('Calendar');
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
      renderEventsPage(events({}).calendar({}).$);

      const calendar0 = await screen.findByText(/calendar title 0/i);
      const calendar1 = await screen.findByText(/calendar title 1/i);
      expect(calendar0).toBeVisible();
      expect(calendar1).toBeVisible();
    });
  });
});
