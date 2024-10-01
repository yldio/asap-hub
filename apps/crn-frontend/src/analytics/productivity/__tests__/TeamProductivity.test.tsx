import { AlgoliaSearchClient } from '@asap-hub/algolia';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { performanceByDocumentType } from '@asap-hub/fixtures';
import { ListTeamProductivityAlgoliaResponse } from '@asap-hub/model';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getTeamProductivity, getTeamProductivityPerformance } from '../api';
import { analyticsTeamProductivityState } from '../state';
import TeamProductivity from '../TeamProductivity';

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

const mockGetTeamProductivity = getTeamProductivity as jest.MockedFunction<
  typeof getTeamProductivity
>;

const mockGetTeamProductivityPerformance =
  getTeamProductivityPerformance as jest.MockedFunction<
    typeof getTeamProductivityPerformance
  >;

const mockSetSort = jest.fn();

const data: ListTeamProductivityAlgoliaResponse = {
  total: 2,
  items: [
    {
      id: '1',
      objectID: '1-team-productivity-30d',
      name: 'Team Alessi',
      isInactive: false,
      Article: 1,
      Bioinformatics: 2,
      Dataset: 3,
      'Lab Material': 4,
      Protocol: 5,
    },
    {
      id: '2',
      objectID: '1-user-productivity-30d',
      name: 'Team De Camilli',
      isInactive: false,
      Article: 0,
      Bioinformatics: 0,
      Dataset: 2,
      'Lab Material': 0,
      Protocol: 1,
    },
  ],
};

const renderPage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          analyticsTeamProductivityState({
            currentPage: 0,
            pageSize: 10,
            timeRange: '30d',
            sort: 'team_asc',
            tags: [],
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/analytics']}>
              <TeamProductivity
                sort="team_asc"
                setSort={mockSetSort}
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

it('renders the team productivity data', async () => {
  mockGetTeamProductivity.mockResolvedValueOnce(data);
  mockGetTeamProductivityPerformance.mockResolvedValueOnce(
    performanceByDocumentType,
  );

  const { container, getAllByText, getAllByTitle } = await renderPage();
  expect(container).toHaveTextContent('Team Alessi');
  expect(container).toHaveTextContent('Team De Camilli');
  expect(getAllByText('0')).toHaveLength(3);
  expect(getAllByText('1')).toHaveLength(3); // one of the 1s is pagination
  expect(getAllByText('2')).toHaveLength(2);
  expect(getAllByText('3')).toHaveLength(1);
  expect(getAllByText('4')).toHaveLength(1);
  expect(getAllByText('5')).toHaveLength(1);
  expect(getAllByTitle('Below Average').length).toEqual(12);
  expect(getAllByTitle('Average').length).toEqual(7);
  expect(getAllByTitle('Above Average').length).toEqual(6);
});
