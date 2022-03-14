import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/gp2-frontend/src/auth/test-utils';
import {
  createListCalendarResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';
import { events } from '@asap-hub/routing';
import userEvent from '@testing-library/user-event';

import Events from '../Events';
import { refreshCalendarsState } from '../calendar/state';
import { getCalendars } from '../calendar/api';
import { getEvents } from '../api';
import { eventsState } from '../state';
import { getEventListOptions } from '../options';

jest.useFakeTimers('modern');

jest.mock('../calendar/api');
jest.mock('../api');

const mockGetCalendars = getCalendars as jest.MockedFunction<
  typeof getCalendars
>;
const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;

const renderEventsPage = async (pathname = events({}).$) => {
  const result = render(
    <RecoilRoot
      initializeState={({ set, reset }) => {
        set(refreshCalendarsState, Math.random());
        reset(eventsState(getEventListOptions(new Date(), false)));
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
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('Renders the events page header', async () => {
  mockGetCalendars.mockResolvedValue(createListCalendarResponse(0));
  const { getByRole } = await renderEventsPage();
  expect(getByRole('heading', { level: 1 }).textContent).toEqual(
    'Calendar and Events',
  );
});

it('Defaults to the calendar page', async () => {
  mockGetCalendars.mockResolvedValue(createListCalendarResponse(0));
  const { getByTitle } = await renderEventsPage();
  expect(getByTitle('Calendar').tagName).toBe('IFRAME');
});

describe('the events calendar page', () => {
  it('renders a google calendar iframe', async () => {
    mockGetCalendars.mockResolvedValue(createListCalendarResponse(0));
    const { getByTitle } = await renderEventsPage(events({}).calendar({}).$);
    expect(getByTitle('Calendar').tagName).toBe('IFRAME');
  });

  it('Displays a list of calendars', async () => {
    mockGetCalendars.mockResolvedValue({
      ...createListCalendarResponse(2),
      items: createListCalendarResponse(2).items.map((item, index) => ({
        ...item,
        name: `Calendar title ${index}`,
      })),
    });
    const { getByText } = await renderEventsPage(events({}).calendar({}).$);
    expect(getByText(/calendar title 0/i)).toBeVisible();
    expect(getByText(/calendar title 1/i)).toBeVisible();
  });
});

describe('the events upcoming page', () => {
  it('renders a list of event cards', async () => {
    mockGetEvents.mockResolvedValue({
      ...createListEventResponse(2),
      items: createListEventResponse(2).items.map((item, index) => ({
        ...item,
        title: `Event title ${index}`,
      })),
    });
    const { getAllByRole } = await renderEventsPage(events({}).upcoming({}).$);
    expect(
      getAllByRole('heading', { level: 3 }).map(
        (heading) => heading.textContent,
      ),
    ).toEqual(['Event title 0', 'Event title 1']);
  });

  it('can search for events', async () => {
    const { getByRole } = await renderEventsPage(events({}).upcoming({}).$);
    userEvent.type(getByRole('searchbox'), 'searchterm');
    await waitFor(() =>
      expect(mockGetEvents).toHaveBeenLastCalledWith(
        expect.objectContaining({ searchQuery: 'searchterm' }),
        expect.anything(),
      ),
    );
  });
});
