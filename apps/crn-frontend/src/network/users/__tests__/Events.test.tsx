import { createListEventResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getEventsFromAlgolia } from '../../../events/api';
import { eventsState } from '../../../events/state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import Events from '../Events';
import { refreshUserState } from '../state';

jest.mock('../../../events/api');
jest.mock('../api');

afterEach(() => {
  jest.resetAllMocks();
});

const mockGetEvents = getEventsFromAlgolia as jest.MockedFunction<
  typeof getEventsFromAlgolia
>;
const date = new Date('2021-12-28T14:00:00.000Z');
beforeEach(() => {
  jest.useFakeTimers('modern').setSystemTime(date);
});
afterEach(() => {
  jest.useRealTimers();
});
const renderEvents = async ({
  searchQuery = '',
  filters = new Set<string>(),
  currentPage = 0,
  pageSize = CARD_VIEW_PAGE_SIZE,
  userId = '42',
} = {}) => {
  render(
    <RecoilRoot
      initializeState={({ reset, set }) => {
        set(refreshUserState(userId), Math.random());
        reset(
          eventsState({
            after: '2021-12-28T14:00:00.000Z',
            searchQuery,
            filters,
            userId,
            currentPage,
            pageSize,
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
                  pathname: network({}).users({}).user({ userId }).upcoming({})
                    .$,
                },
              ]}
            >
              <Route
                path={network({}).users({}).user({ userId }).upcoming({}).$}
              >
                <Events
                  userId={userId}
                  currentTime={date}
                  searchQuery={searchQuery}
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

it('renders a list of events', async () => {
  const searchQuery = 'searchterm';
  const userId = '12345';
  mockGetEvents.mockResolvedValue(createListEventResponse(2));
  await renderEvents({ searchQuery, userId });
  expect(screen.getByText(/2 results found/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Event 0/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Event 1/i })).toBeInTheDocument();
  expect(mockGetEvents).toHaveBeenLastCalledWith(expect.anything(), {
    searchQuery,
    after: '2021-12-28T13:00:00.000Z',
    filters: new Set(),
    userId,
    currentPage: 0,
    pageSize: CARD_VIEW_PAGE_SIZE,
  });
});
