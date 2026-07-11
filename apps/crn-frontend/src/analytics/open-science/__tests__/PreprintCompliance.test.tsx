import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { render, screen, waitFor } from '@testing-library/react';
import React, { Suspense } from 'react';
import { fireEvent } from '@testing-library/dom';
import { MemoryRouter, useNavigate } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  ListPreprintComplianceOpensearchResponse,
  PreprintComplianceOpensearchResponse,
  SortPreprintCompliance,
} from '@asap-hub/model';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import PreprintCompliance from '../PreprintCompliance';
import {
  preprintComplianceQueryKeys,
  useAnalyticsPreprintCompliance,
} from '../state';

const mockGetPreprintCompliance = jest.fn();
jest.mock('../api', () => ({
  getPreprintCompliance: (...args: unknown[]) =>
    mockGetPreprintCompliance(...args),
}));

// Shared ErrorBoundary component for tests
const createErrorBoundary = (onError: (error: Error) => void) => {
  class TestErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
  > {
    state = { hasError: false };

    static getDerivedStateFromError(err: Error) {
      onError(err);
      return { hasError: true };
    }

    render() {
      if (this.state.hasError) {
        return <div data-testid="error">Error caught</div>;
      }
      return this.props.children;
    }
  }
  return TestErrorBoundary;
};

const mockSearch = jest.fn();
jest.mock('../../../hooks', () => ({
  useAnalytics: () => ({ timeRange: 'all' }),
  usePaginationParams: () => ({ currentPage: 0, pageSize: 10 }),
  usePagination: () => ({ numberOfPages: 1, renderPageHref: jest.fn() }),
  useAnalyticsOpensearch: () => ({
    client: {
      search: mockSearch,
      getTagSuggestions: jest.fn(),
    },
  }),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

mockConsoleError();

jest.spyOn(console, 'error').mockImplementation();

const mockNavigate = jest.fn();
const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

const sortOptions: SortPreprintCompliance[] = [
  'team_asc',
  'team_desc',
  'number_of_preprints_asc',
  'number_of_preprints_desc',
  'posted_prior_asc',
  'posted_prior_desc',
];

describe('PreprintCompliance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockGetPreprintCompliance.mockResolvedValue({
      items: [],
      total: 0,
    });
    mockSearch.mockResolvedValue({ items: [], total: 0 });
  });

  const renderPage = (initialEntries: string[] = ['/']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <QueryClientProvider client={createTestQueryClient()}>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <PreprintCompliance tags={[]} />
              </WhenReady>
            </Auth0Provider>
          </Suspense>
        </QueryClientProvider>
      </MemoryRouter>,
    );

  it('renders preprint compliance correctly', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Number of Preprints')).toBeInTheDocument();
    });
  });

  it('caches and clears preprint compliance data by query key', async () => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort: 'team_asc' as const,
      tags: [] as string[],
      timeRange: 'all' as const,
    };
    const queryClient = createTestQueryClient();
    const queryKey = preprintComplianceQueryKeys.list(stateOptions);

    // Initially undefined
    expect(queryClient.getQueryData(queryKey)).toBeUndefined();

    const fakeData: ListPreprintComplianceOpensearchResponse = {
      total: 1,
      items: [
        {
          objectID: 'team-123',
          teamId: 'team-123',
          teamName: 'Team 123',
          isTeamInactive: false,
          numberOfPreprints: 2,
          numberOfPublications: 1,
          ranking: 'ADEQUATE',
          timeRange: 'all',
          postedPriorPercentage: 50,
        },
      ],
    };
    queryClient.setQueryData(queryKey, fakeData);
    expect(queryClient.getQueryData(queryKey)).toEqual(fakeData);

    queryClient.removeQueries({ queryKey });
    expect(queryClient.getQueryData(queryKey)).toBeUndefined();
  });

  it('passes sort parameter to API when sorting changes', async () => {
    renderPage();

    await waitFor(() => {
      expect(mockGetPreprintCompliance).toHaveBeenCalled();
    });

    expect(mockGetPreprintCompliance).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        sort: 'team_asc',
      }),
    );
  });

  it('reads valid sort from URL and passes it to API', async () => {
    renderPage([
      '/analytics/open-science/preprint-compliance?sort=posted_prior_desc',
    ]);

    await waitFor(() => {
      expect(mockGetPreprintCompliance).toHaveBeenCalled();
    });

    expect(mockGetPreprintCompliance).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        sort: 'posted_prior_desc',
      }),
    );
  });

  it('calls navigate with new sort and replace when column sort button is clicked', async () => {
    renderPage([
      '/analytics/open-science/preprint-compliance?currentPage=2&sort=team_asc',
    ]);

    await waitFor(() => {
      expect(screen.getByText('Number of Preprints')).toBeInTheDocument();
    });

    const header = screen.getByRole('columnheader', {
      name: /Number of Preprints/,
    });
    const sortButton = header.querySelector('button');
    fireEvent.click(sortButton!);

    expect(mockNavigate).toHaveBeenCalledWith(
      { search: 'sort=number_of_preprints_desc' } as never,
      { replace: true },
    );
  });

  it.each(sortOptions)('handles sort option %s in the query key', (sort) => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort,
      tags: [] as string[],
      timeRange: 'all' as const,
    };
    const queryClient = createTestQueryClient();
    const queryKey = preprintComplianceQueryKeys.list(stateOptions);

    const fakeData: ListPreprintComplianceOpensearchResponse = {
      total: 1,
      items: [
        {
          objectID: 'team-123',
          teamId: 'team-123',
          teamName: 'Team 123',
          isTeamInactive: false,
          numberOfPreprints: 2,
          numberOfPublications: 1,
          ranking: 'ADEQUATE',
          timeRange: 'all',
          postedPriorPercentage: 50,
        },
      ],
    };
    queryClient.setQueryData(queryKey, fakeData);
    expect(queryClient.getQueryData(queryKey)).toEqual(fakeData);
  });

  it('handles sorting with tags filter in the query key', () => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort: 'posted_prior_desc' as const,
      tags: ['tag1', 'tag2'] as string[],
      timeRange: 'all' as const,
    };
    const queryClient = createTestQueryClient();
    const queryKey = preprintComplianceQueryKeys.list(stateOptions);

    const fakeData: ListPreprintComplianceOpensearchResponse = {
      total: 1,
      items: [
        {
          objectID: 'team-123',
          teamId: 'team-123',
          teamName: 'Team 123',
          isTeamInactive: false,
          numberOfPreprints: 10,
          numberOfPublications: 8,
          ranking: 'ADEQUATE',
          timeRange: 'all',
          postedPriorPercentage: 80,
        },
      ],
    };
    queryClient.setQueryData(queryKey, fakeData);
    expect(queryClient.getQueryData(queryKey)).toEqual(fakeData);
  });
});

describe('error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles API errors when fetching preprint compliance data', async () => {
    const error = new Error('Failed to fetch preprint compliance data');
    mockGetPreprintCompliance.mockRejectedValueOnce(error);

    let caughtError: Error | null = null;
    const ErrorBoundary = createErrorBoundary((err) => {
      caughtError = err;
    });

    const TestComponent = () => {
      useAnalyticsPreprintCompliance({
        currentPage: 0,
        pageSize: 10,
        sort: 'team_asc',
        tags: [],
        timeRange: 'all',
      });
      return <div>Success</div>;
    };

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <ErrorBoundary>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <TestComponent />
              </WhenReady>
            </Auth0Provider>
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>,
    );

    // The rejection is cached and thrown to the error boundary (covers the
    // queryFn's Error re-throw, the translation of `.catch(set)` + `throw`)
    await waitFor(() => {
      expect(caughtError?.message).toBe(
        'Failed to fetch preprint compliance data',
      );
    });
  });

  it('renders when the fetch resolves valid preprint compliance data', async () => {
    const mockTeam1: PreprintComplianceOpensearchResponse = {
      objectID: 'team-1',
      teamId: 'team-1',
      teamName: 'Team 1',
      isTeamInactive: false,
      numberOfPreprints: 10,
      numberOfPublications: 8,
      ranking: 'ADEQUATE',
      timeRange: 'all',
      postedPriorPercentage: 80,
    };
    const mockTeam2: PreprintComplianceOpensearchResponse = {
      objectID: 'team-2',
      teamId: 'team-2',
      teamName: 'Team 2',
      isTeamInactive: false,
      numberOfPreprints: 5,
      numberOfPublications: 4,
      ranking: 'NEEDS IMPROVEMENT',
      timeRange: 'all',
      postedPriorPercentage: 60,
    };

    const mockData: ListPreprintComplianceOpensearchResponse = {
      total: 2,
      items: [mockTeam1, mockTeam2],
    };

    mockGetPreprintCompliance.mockResolvedValueOnce(mockData);

    const TestComponent = () => {
      const result = useAnalyticsPreprintCompliance({
        currentPage: 0,
        pageSize: 10,
        sort: 'team_asc',
        tags: [],
        timeRange: 'all',
      });
      return <div data-testid="success">{result.items.length} teams</div>;
    };

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <TestComponent />
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('success')).toHaveTextContent('2 teams');
    expect(mockGetPreprintCompliance).toHaveBeenCalled();
  });
});
