import { createListEventResponse } from '@asap-hub/fixtures';
import { EventConstraint } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getEvents } from '../../events/api';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import Events from '../EventsEmbedList';

jest.mock('../../events/api');

afterEach(() => {
  jest.resetAllMocks();
});

const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
const date = new Date('2021-12-28T14:00:00.000Z');
const renderEvents = async ({
  searchQuery = '',
  constraint,
  pathName,
  isPast = false,
  noEventsComponent,
}: {
  searchQuery?: string;
  constraint: EventConstraint;
  pathName: string;
  isPast?: boolean;
  hasEvents?: boolean;
  noEventsComponent?: React.ReactNode;
}) => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                {
                  pathname: pathName,
                },
              ]}
            >
              <Routes>
                <Route
                  path={pathName}
                  element={
                    <Events
                      constraint={constraint}
                      currentTime={date}
                      past={isPast}
                      noEventsComponent={noEventsComponent}
                    />
                  }
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );
  await waitFor(
    () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    { timeout: 30_000 },
  );
};

const userPath = (userId: string) =>
  network({}).users({}).user({ userId }).upcoming({}).$;
const teamPath = (teamId: string) =>
  network({}).teams({}).team({ teamId }).upcoming({}).$;
it.each`
  description                     | constraint            | getPath     | after                         | before
  ${'upcoming events by userId '} | ${{ userId: '1013' }} | ${userPath} | ${'2021-12-28T13:00:00.000Z'} | ${undefined}
  ${'upcoming events by teamId '} | ${{ teamId: '1009' }} | ${teamPath} | ${'2021-12-28T13:00:00.000Z'} | ${undefined}
`(
  'renders a list of $description',
  async ({ constraint, getPath, after, before }) => {
    const searchQuery = 'a team';
    mockGetEvents.mockResolvedValue(createListEventResponse(2));
    const pathName = getPath(constraint.userId || constraint.teamId);
    await renderEvents({ constraint, pathName });
    await userEvent.type(screen.getByRole('searchbox'), searchQuery);
    expect(screen.getByText(/2 results found/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Event 0/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Event 1/i }),
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(mockGetEvents).toHaveBeenLastCalledWith(expect.anything(), {
        searchQuery,
        after,
        before,
        filters: new Set(),
        constraint,
        currentPage: 0,
        pageSize: CARD_VIEW_PAGE_SIZE,
      }),
    );
  },
);

describe('EventsEmbed with no upcoming events', () => {
  it('shows the component for no upcoming events', async () => {
    const constraint = { teamId: '1010' };
    const pathName = teamPath(constraint.teamId);
    const isPast = false;

    mockGetEvents.mockResolvedValue(createListEventResponse(0));

    const noEventsComponent = <>No Upcoming Events</>;

    await renderEvents({ constraint, pathName, noEventsComponent, isPast });

    await waitFor(() => {
      expect(screen.getByText(/no upcoming events/i)).toBeInTheDocument();
    });
  });

  it('shows the component for no past events', async () => {
    const constraint = { teamId: '1010' };
    const pathName = teamPath(constraint.teamId);
    const isPast = true;

    mockGetEvents.mockResolvedValue(createListEventResponse(0));

    const noEventsComponent = <>No Past Events</>;

    await renderEvents({ constraint, pathName, noEventsComponent, isPast });

    await waitFor(() => {
      expect(screen.getByText(/no past events/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no noEventsComponent is passed', async () => {
    const constraint = { teamId: '1010' };
    const pathName = teamPath(constraint.teamId);
    const isPast = false;

    mockGetEvents.mockResolvedValue(createListEventResponse(0));

    await renderEvents({ constraint, pathName, isPast });

    await waitFor(() => {
      expect(screen.queryByText(/no upcoming events/i)).not.toBeInTheDocument();
      expect(
        screen.getByText(/no results have been found/i),
      ).toBeInTheDocument();
    });
  });
});
