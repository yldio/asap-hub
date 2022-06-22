import { createListEventResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot, RecoilState } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getEventsFromAlgolia } from '../../events/api';
import { eventsState } from '../../events/state';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import Events from '../EventsEmbed';
import { refreshTeamState } from '../teams/state';
import { refreshUserState } from '../users/state';

jest.mock('../../events/api');

afterEach(() => {
  jest.resetAllMocks();
});

const mockGetEvents = getEventsFromAlgolia as jest.MockedFunction<
  typeof getEventsFromAlgolia
>;
const date = new Date('2021-12-28T14:00:00.000Z');
const renderEvents = async ({
  searchQuery = '',
  userId,
  teamId,
  pathName,
  state,
  isPast,
}: {
  searchQuery?: string;
  userId?: string;
  teamId?: string;
  pathName: string;
  state: RecoilState<number>;
  isPast: boolean;
}) => {
  render(
    <RecoilRoot
      initializeState={({ reset, set }) => {
        set(state, Math.random());
        reset(
          eventsState({
            after: '2021-12-28T14:00:00.000Z',
            searchQuery,
            filters: new Set<string>(),
            userId,
            currentPage: 0,
            pageSize: CARD_VIEW_PAGE_SIZE,
          }),
        );
      }}
    >
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
              <Route path={pathName}>
                <Events
                  userId={userId}
                  teamId={teamId}
                  currentTime={date}
                  past={isPast}
                />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
const userPath = (userId: string) =>
  network({}).users({}).user({ userId }).upcoming({}).$;
const teamPath = (teamId: string) =>
  network({}).teams({}).team({ teamId }).upcoming({}).$;
it.each`
  description                     | isPast   | userId       | teamId       | getPath     | refreshState        | after                         | before
  ${'upcoming events by userId '} | ${false} | ${'1013'}    | ${undefined} | ${userPath} | ${refreshUserState} | ${'2021-12-28T13:00:00.000Z'} | ${undefined}
  ${'upcoming events by teamId '} | ${false} | ${undefined} | ${'1009'}    | ${teamPath} | ${refreshTeamState} | ${'2021-12-28T13:00:00.000Z'} | ${undefined}
`(
  'renders a list of $description',
  async ({ userId, teamId, getPath, refreshState, isPast, after, before }) => {
    const searchQuery = 'a team';
    mockGetEvents.mockResolvedValue(createListEventResponse(2));
    const pathName = getPath(userId || teamId);
    const state = refreshState(teamId);
    await renderEvents({ userId, teamId, pathName, state, isPast });
    userEvent.type(screen.getByRole('searchbox'), searchQuery);
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
        teamId,
        userId,
        currentPage: 0,
        pageSize: CARD_VIEW_PAGE_SIZE,
      }),
    );
  },
);
