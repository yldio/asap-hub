import { AlgoliaSearchClient } from '@asap-hub/algolia';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { userProductivityPerformance } from '@asap-hub/fixtures';
import {
  ListUserProductivityAlgoliaResponse,
  UserProductivityAlgoliaResponse,
} from '@asap-hub/model';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getUserProductivity, getUserProductivityPerformance } from '../api';
import { analyticsUserProductivityState } from '../state';
import UserProductivity from '../UserProductivity';

jest.mock('@asap-hub/algolia', () => ({
  ...jest.requireActual('@asap-hub/algolia'),
  algoliaSearchClientFactory: jest
    .fn()
    .mockReturnValue({} as AlgoliaSearchClient<'crn'>),
}));

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetUserProductivity = getUserProductivity as jest.MockedFunction<
  typeof getUserProductivity
>;

const mockGetUserProductivityPerformance =
  getUserProductivityPerformance as jest.MockedFunction<
    typeof getUserProductivityPerformance
  >;

const mockSetSort = jest.fn();

const userTeam: UserProductivityAlgoliaResponse['teams'][number] = {
  id: '1',
  team: 'Team A',
  isTeamInactive: false,
  isUserInactiveOnTeam: false,
  role: 'Collaborating PI',
};

const userProductivity: ListUserProductivityAlgoliaResponse = {
  total: 2,
  items: [
    {
      id: '1',
      objectID: '1-user-productivity-30d',
      name: 'Ted Mosby',
      isAlumni: false,
      teams: [userTeam],
      asapOutput: 3,
      asapPublicOutput: 1,
      ratio: '0.33',
    },
    {
      id: '2',
      objectID: '2-user-productivity-30d',
      name: 'Robin Scherbatsky',
      isAlumni: false,
      teams: [{ ...userTeam, role: 'Key Personnel' }],
      asapOutput: 4,
      asapPublicOutput: 1,
      ratio: '0.25',
    },
  ],
};

const renderPage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          analyticsUserProductivityState({
            currentPage: 0,
            pageSize: 10,
            timeRange: '30d',
            documentCategory: 'all',
            sort: 'user_asc',
            tags: [],
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/analytics']}>
              <UserProductivity
                setSort={mockSetSort}
                sort={'user_asc'}
                tags={[]}
              />
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

it('renders the user productivity data', async () => {
  mockGetUserProductivity.mockResolvedValueOnce(userProductivity);
  mockGetUserProductivityPerformance.mockResolvedValueOnce(
    userProductivityPerformance,
  );

  const { container, getAllByText, getAllByTitle } = await renderPage();
  expect(container).toHaveTextContent('Ted Mosby');
  expect(container).toHaveTextContent('Collaborating PI');
  expect(container).toHaveTextContent('Robin Scherbatsky');
  expect(container).toHaveTextContent('Key Personnel');
  expect(getAllByText('1')).toHaveLength(3); // one of the 1s is pagination
  expect(getAllByText('3')).toHaveLength(1);
  expect(getAllByText('4')).toHaveLength(1);
  expect(getAllByText('0.33')).toHaveLength(1);
  expect(getAllByText('0.25')).toHaveLength(1);
  expect(getAllByTitle('Below Average').length).toEqual(3);
  expect(getAllByTitle('Average').length).toEqual(9);
  expect(getAllByTitle('Above Average').length).toEqual(3);
});
