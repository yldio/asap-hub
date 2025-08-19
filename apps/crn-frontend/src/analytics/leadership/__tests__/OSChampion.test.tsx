import { AlgoliaSearchClient } from '@asap-hub/algolia';
import { ListOSChampionResponse } from '@asap-hub/model';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getAnalyticsOSChampion } from '../api';
import { analyticsOSChampionState } from '../state';
import OSChampion from '../OSChampion';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';

jest.mock('@asap-hub/algolia', () => ({
  ...jest.requireActual('@asap-hub/algolia'),
  algoliaSearchClientFactory: jest
    .fn()
    .mockReturnValue({} as AlgoliaSearchClient<'analytics'>),
}));

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetAnalyticsOSChampion =
  getAnalyticsOSChampion as jest.MockedFunction<typeof getAnalyticsOSChampion>;

const mockSetSort = jest.fn();

const data: ListOSChampionResponse = {
  total: 2,
  items: [
    {
      teamId: 'team-id-1',
      teamName: 'Team One',
      isTeamInactive: false,
      teamAwardsCount: 2,
      users: [
        {
          id: 'user-id-1',
          name: 'Test User One',
          awardsCount: 1,
        },
        {
          id: 'user-id-2',
          name: 'Test User Two',
          awardsCount: 1,
        },
      ],
    },
    {
      teamId: 'team-id-2',
      teamName: 'Team Two',
      isTeamInactive: false,
      teamAwardsCount: 0,
      users: [],
    },
  ],
};

const renderPage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          analyticsOSChampionState({
            currentPage: 0,
            pageSize: 10,
            tags: [],
            sort: 'team_asc',
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/analytics']}>
              <OSChampion tags={[]} sort="team_asc" setSort={mockSetSort} />
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

it('renders os champion data', async () => {
  mockGetAnalyticsOSChampion.mockResolvedValue(data);

  const { container, getAllByText } = await renderPage();
  expect(container).toHaveTextContent('Team One');
  expect(container).toHaveTextContent('Team Two');

  expect(getAllByText('2')).toHaveLength(1);
  expect(getAllByText('0')).toHaveLength(1);
});
