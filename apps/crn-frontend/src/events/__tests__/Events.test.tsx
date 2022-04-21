import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createListCalendarResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';
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
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};
beforeEach(() => {
  jest.clearAllMocks();
});

it('Renders the events page header', async () => {
  mockGetCalendars.mockResolvedValue(createListCalendarResponse(0));
  await renderEventsPage();
  expect(screen.getByRole('heading', { level: 1 }).textContent).toEqual(
    'Calendar and Events',
  );
});

it('Defaults to the upcoming events page', async () => {
  mockGetEvents.mockImplementation((params) => {
    const eventsExpected = 'before' in params ? 'expected' : 'ignore';
    return Promise.resolve({
      ...createListEventResponse(1),
      items: createListEventResponse(1).items.map((item, index) => ({
        ...item,
        title: `Event title ${eventsExpected}`,
      })),
    });
  });
  await renderEventsPage();
  expect(
    screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent),
  ).toEqual(['Event title expected']);
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

describe.each`
  routeName     | eventProperty | route
  ${'past'}     | ${'after'}    | ${events({}).past({}).$}
  ${'upcoming'} | ${'before'}   | ${events({}).upcoming({}).$}
`('the events $routeName page', ({ eventProperty, route }) => {
  it('renders a list of event cards', async () => {
    mockGetEvents.mockImplementation((params) => {
      const eventsExpected = eventProperty in params ? 'expected' : 'ignore';
      return Promise.resolve({
        ...createListEventResponse(2),
        items: createListEventResponse(2).items.map((item, index) => ({
          ...item,
          title: `Event title ${index} ${eventsExpected}`,
        })),
      });
    });

    await renderEventsPage(route);
    expect(
      screen
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Event title 0 expected', 'Event title 1 expected']);
  });

  it('can search for events', async () => {
    await renderEventsPage(route);
    userEvent.type(screen.getByRole('searchbox'), 'searchterm');
    await waitFor(() =>
      expect(mockGetEvents).toHaveBeenLastCalledWith(
        expect.objectContaining({ searchQuery: 'searchterm' }),
        expect.anything(),
      ),
    );
  });
});
