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
}: {
  searchQuery?: string;
  userId?: string;
  teamId?: string;
  pathName: string;
  state: RecoilState<number>;
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
                  past={false}
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

it('renders a list of events filterd by userId', async () => {
  const searchQuery = 'a user';
  const userId = '1009';
  mockGetEvents.mockResolvedValue(createListEventResponse(2));
  const pathName = network({}).users({}).user({ userId }).upcoming({}).$;
  const state = refreshUserState(userId);
  await renderEvents({ userId, pathName, state });
  userEvent.type(screen.getByRole('searchbox'), searchQuery);
  expect(screen.getByText(/2 results found/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Event 0/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Event 1/i })).toBeInTheDocument();

  await waitFor(() =>
    expect(mockGetEvents).toHaveBeenLastCalledWith(expect.anything(), {
      searchQuery,
      after: '2021-12-28T13:00:00.000Z',
      filters: new Set(),
      userId,
      currentPage: 0,
      pageSize: CARD_VIEW_PAGE_SIZE,
    }),
  );
});

it('renders a list of events filterd by teamId', async () => {
  const searchQuery = 'a team';
  const teamId = '1013';
  mockGetEvents.mockResolvedValue(createListEventResponse(2));
  const pathName = network({}).teams({}).team({ teamId }).upcoming({}).$;
  const state = refreshTeamState(teamId);
  await renderEvents({ teamId, pathName, state });
  userEvent.type(screen.getByRole('searchbox'), searchQuery);
  expect(screen.getByText(/2 results found/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Event 0/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Event 1/i })).toBeInTheDocument();

  await waitFor(() =>
    expect(mockGetEvents).toHaveBeenLastCalledWith(expect.anything(), {
      searchQuery,
      after: '2021-12-28T13:00:00.000Z',
      filters: new Set(),
      teamId,
      currentPage: 0,
      pageSize: CARD_VIEW_PAGE_SIZE,
    }),
  );
});
