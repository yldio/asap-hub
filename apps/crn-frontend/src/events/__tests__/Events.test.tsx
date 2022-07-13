import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createListCalendarResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';
import { useFlags } from '@asap-hub/react-context';
import { events } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getEvents, getEventsFromAlgolia } from '../api';
import { getCalendars } from '../calendar/api';
import { refreshCalendarsState } from '../calendar/state';
import Events from '../Events';
import { getEventListOptions } from '../options';
import { eventsState } from '../state';

jest.useFakeTimers('modern');

jest.mock('../calendar/api');
jest.mock('../api');

const setupAlgoliaEventsSearchFlag = (enabled: boolean) => {
  const {
    result: {
      current: { disable, enable },
    },
  } = renderHook(useFlags);
  if (enabled) {
    enable('EVENTS_SEARCH');
  } else {
    disable('EVENTS_SEARCH');
  }
};

const mockGetCalendars = getCalendars as jest.MockedFunction<
  typeof getCalendars
>;
const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
const mockGetEventsFromAlgolia = getEventsFromAlgolia as jest.MockedFunction<
  typeof getEventsFromAlgolia
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
  beforeEach(() => {
    setupAlgoliaEventsSearchFlag(false);
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
      const eventsExpected = 'before' in params ? 'past' : 'upcoming';
      return Promise.resolve({
        ...createListEventResponse(1),
        items: createListEventResponse(1).items.map((item, index) => ({
          ...item,
          title: `${eventsExpected} Event title`,
        })),
      });
    });
    await renderEventsPage();
    expect(
      screen
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['upcoming Event title']);
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

describe('Legacy', () => {
  beforeEach(() => {
    setupAlgoliaEventsSearchFlag(false);
  });

  describe.each`
    eventProperty | route                        | expected      | nonExpected
    ${'before'}   | ${events({}).past({}).$}     | ${'past'}     | ${'upcoming'}
    ${'after'}    | ${events({}).upcoming({}).$} | ${'upcoming'} | ${'past'}
  `(
    'the events $expected page',
    ({ eventProperty, route, expected, nonExpected }) => {
      it('renders a list of event cards', async () => {
        let eventsExpected = 'ignore';
        mockGetEvents.mockImplementation((params) => {
          eventsExpected = eventProperty in params ? expected : nonExpected;

          return Promise.resolve({
            ...createListEventResponse(2),
            items: createListEventResponse(2).items.map((item, index) => ({
              ...item,
              title: `${eventsExpected} Event title ${index}`,
            })),
          });
        });

        await renderEventsPage(route);
        expect(
          screen
            .getAllByRole('heading', { level: 3 })
            .map((heading) => heading.textContent),
        ).toEqual([
          `${eventsExpected} Event title 0`,
          `${eventsExpected} Event title 1`,
        ]);
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
    },
  );
});

describe('Algolia', () => {
  beforeEach(() => {
    setupAlgoliaEventsSearchFlag(true);
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
});
