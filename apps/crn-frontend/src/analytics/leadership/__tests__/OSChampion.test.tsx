import { ListOSChampionOpensearchResponse } from '@asap-hub/model';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getAnalyticsOSChampion } from '../api';
import { analyticsOSChampionState } from '../state';
import OSChampion from '../OSChampion';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetAnalyticsOSChampion =
  getAnalyticsOSChampion as jest.MockedFunction<typeof getAnalyticsOSChampion>;

const mockSetSort = jest.fn();

const data: ListOSChampionOpensearchResponse = {
  total: 2,
  items: [
    {
      objectID: 'object-id-1',
      teamId: 'team-id-1',
      teamName: 'Team One',
      isTeamInactive: false,
      teamAwardsCount: 2,
      timeRange: 'all',
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
      objectID: 'object-id-2',
      teamId: 'team-id-2',
      teamName: 'Team Two',
      isTeamInactive: false,
      teamAwardsCount: 0,
      timeRange: 'all',
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
            timeRange: 'all',
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

  await waitFor(() => {
    expect(container).toHaveTextContent('Team One');
    expect(container).toHaveTextContent('Team Two');
  });

  await waitFor(() => {
    expect(getAllByText('2')).toHaveLength(1);
    expect(getAllByText('0')).toHaveLength(1);
  });
});
