import { ListOSChampionOpensearchResponse } from '@asap-hub/model';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, useNavigate } from 'react-router';
import { RecoilRoot } from 'recoil';

import { getAnalyticsOSChampion } from '../api';
import { analyticsOSChampionState } from '../state';
import OSChampion from '../OSChampion';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';

jest.mock('../api', () => ({
  getAnalyticsOSChampion: jest.fn().mockResolvedValue({
    items: [],
    total: 0,
  }),
}));

jest.mock('../../../hooks', () => ({
  useAnalytics: () => ({ timeRange: 'all' }),
  usePaginationParams: () => ({ currentPage: 0, pageSize: 10 }),
  usePagination: () => ({ numberOfPages: 1, renderPageHref: jest.fn() }),
  useAnalyticsOpensearch: () => ({
    client: {
      search: jest.fn().mockResolvedValue({ items: [], total: 0 }),
      getTagSuggestions: jest.fn(),
    },
  }),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

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

describe('OSChampion', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders os champion data', async () => {
    const mockGetAnalyticsOSChampion =
      getAnalyticsOSChampion as jest.MockedFunction<
        typeof getAnalyticsOSChampion
      >;
    mockGetAnalyticsOSChampion.mockResolvedValue(data);

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
              <MemoryRouter initialEntries={['/analytics?sort=team_asc']}>
                <OSChampion tags={[]} />
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );

    await waitFor(() =>
      expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await waitFor(() => {
      expect(result.container).toHaveTextContent('Team One');
      expect(result.container).toHaveTextContent('Team Two');
    });

    await waitFor(() => {
      expect(result.getAllByText('2')).toHaveLength(1);
      expect(result.getAllByText('0')).toHaveLength(1);
    });
  });

  it('reads valid sort from URL and passes it to API', async () => {
    const mockGetAnalyticsOSChampion =
      getAnalyticsOSChampion as jest.MockedFunction<
        typeof getAnalyticsOSChampion
      >;
    mockGetAnalyticsOSChampion.mockResolvedValue({
      items: [],
      total: 0,
    });

    render(
      <MemoryRouter
        initialEntries={[
          '/analytics/leadership/os-champion?sort=os_champion_awards_desc',
        ]}
      >
        <RecoilRoot>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <OSChampion tags={[]} />
              </WhenReady>
            </Auth0Provider>
          </Suspense>
        </RecoilRoot>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText('Total number of Open Science Champion awards'),
      ).toBeInTheDocument();
    });

    expect(mockGetAnalyticsOSChampion).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        sort: 'os_champion_awards_desc',
      }),
    );
  });

  it('calls navigate with new sort and replace when column sort button is clicked', async () => {
    const mockGetAnalyticsOSChampion =
      getAnalyticsOSChampion as jest.MockedFunction<
        typeof getAnalyticsOSChampion
      >;
    mockGetAnalyticsOSChampion.mockResolvedValue({
      items: [],
      total: 0,
    });

    render(
      <MemoryRouter>
        <RecoilRoot>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <OSChampion tags={[]} />
              </WhenReady>
            </Auth0Provider>
          </Suspense>
        </RecoilRoot>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText('Total number of Open Science Champion awards'),
      ).toBeInTheDocument();
    });

    const awardsHeader = screen.getByRole('columnheader', {
      name: /Total number of Open Science Champion awards/,
    });
    const sortButton = awardsHeader.querySelector('button');
    fireEvent.click(sortButton!);

    expect(mockNavigate).toHaveBeenCalledWith(
      { search: 'sort=os_champion_awards_desc' } as never,
      { replace: true },
    );
  });
});
