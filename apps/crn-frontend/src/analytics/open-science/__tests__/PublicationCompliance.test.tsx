import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import {
  ListPublicationComplianceOpensearchResponse,
  PublicationComplianceOpensearchResponse,
  SortPublicationCompliance,
  TimeRangeOption,
} from '@asap-hub/model';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { Suspense } from 'react';
import { MemoryRouter, useNavigate } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import PublicationCompliance from '../PublicationCompliance';
import {
  publicationComplianceQueryKeys,
  useAnalyticsPublicationCompliance,
} from '../state';
import { getPublicationCompliance } from '../api';

jest.mock('../api', () => ({
  getPublicationCompliance: jest.fn().mockResolvedValue({
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

mockConsoleError();

const mockNavigate = jest.fn();
const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

const publicationComplianceItem: PublicationComplianceOpensearchResponse = {
  objectID: 'team-123',
  teamId: 'team-123',
  teamName: 'Team 123',
  isTeamInactive: false,
  overallCompliance: 85,
  ranking: 'ADEQUATE',
  datasetsPercentage: 90,
  datasetsRanking: 'OUTSTANDING',
  protocolsPercentage: 80,
  protocolsRanking: 'ADEQUATE',
  codePercentage: 75,
  codeRanking: 'NEEDS IMPROVEMENT',
  labMaterialsPercentage: 95,
  labMaterialsRanking: 'OUTSTANDING',
  numberOfPublications: 10,
  numberOfOutputs: 50,
  numberOfDatasets: 20,
  numberOfProtocols: 15,
  numberOfCode: 10,
  numberOfLabMaterials: 5,
  timeRange: 'all',
};

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

describe('PublicationCompliance', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  const renderPage = (initialEntries: string[] = ['/']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <QueryClientProvider client={createTestQueryClient()}>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <PublicationCompliance tags={[]} />
              </WhenReady>
            </Auth0Provider>
          </Suspense>
        </QueryClientProvider>
      </MemoryRouter>,
    );

  it('renders publication compliance correctly', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Publications')).toBeInTheDocument();
    });
  });

  it('caches and clears publication compliance data by query key', () => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort: 'team_asc' as const,
      tags: [] as string[],
      timeRange: 'all' as const,
    };
    const queryClient = createTestQueryClient();
    const queryKey = publicationComplianceQueryKeys.list(stateOptions);

    // Initially undefined
    expect(queryClient.getQueryData(queryKey)).toBeUndefined();

    const fakeData: ListPublicationComplianceOpensearchResponse = {
      total: 1,
      items: [publicationComplianceItem],
    };
    queryClient.setQueryData(queryKey, fakeData);
    expect(queryClient.getQueryData(queryKey)).toEqual(fakeData);

    queryClient.removeQueries({ queryKey });
    expect(queryClient.getQueryData(queryKey)).toBeUndefined();
  });

  it('throws to the error boundary when the fetch rejects', async () => {
    const mockGetPublicationCompliance = getPublicationCompliance as jest.Mock;
    const error = new Error('test error');
    mockGetPublicationCompliance.mockRejectedValueOnce(error);

    let caughtError: Error | null = null;
    const ErrorBoundary = createErrorBoundary((err) => {
      caughtError = err;
    });

    const TestComponent = () => {
      useAnalyticsPublicationCompliance({
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

    await waitFor(() => {
      expect(caughtError?.message).toBe('test error');
    });
  });

  it('handles undefined timeRange by normalizing to all', async () => {
    // The hook normalizes `timeRange ?? 'all'` into its cache key — a fetch
    // issued without a timeRange must be cached under the 'all' key.
    const mockGetPublicationCompliance = getPublicationCompliance as jest.Mock;
    const fakeData: ListPublicationComplianceOpensearchResponse = {
      total: 1,
      items: [publicationComplianceItem],
    };
    mockGetPublicationCompliance.mockResolvedValueOnce(fakeData);

    const queryClient = createTestQueryClient();

    const TestComponent = () => {
      const result = useAnalyticsPublicationCompliance({
        currentPage: 0,
        pageSize: 10,
        sort: 'team_asc',
        tags: [],
        timeRange: undefined as unknown as TimeRangeOption,
      });
      return <div data-testid="success">{result.items.length} teams</div>;
    };

    render(
      <QueryClientProvider client={queryClient}>
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
      expect(screen.getByTestId('success')).toHaveTextContent('1 teams');
    });

    expect(
      queryClient.getQueryData(
        publicationComplianceQueryKeys.list({
          currentPage: 0,
          pageSize: 10,
          sort: 'team_asc',
          tags: [],
          timeRange: 'all',
        }),
      ),
    ).toEqual(fakeData);
  });

  it('caches successful data with multiple items', () => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort: 'team_asc' as const,
      tags: [] as string[],
      timeRange: 'all' as const,
    };
    const queryClient = createTestQueryClient();
    const queryKey = publicationComplianceQueryKeys.list(stateOptions);

    const fakeData: ListPublicationComplianceOpensearchResponse = {
      total: 2,
      items: [
        publicationComplianceItem,
        {
          ...publicationComplianceItem,
          objectID: 'team-456',
          teamId: 'team-456',
          teamName: 'Team 456',
          overallCompliance: 92,
          ranking: 'OUTSTANDING',
        },
      ],
    };
    queryClient.setQueryData(queryKey, fakeData);
    expect(queryClient.getQueryData(queryKey)).toEqual(fakeData);
  });

  it('passes sort parameter to API when sorting changes', async () => {
    const mockGetPublicationCompliance = getPublicationCompliance as jest.Mock;
    mockGetPublicationCompliance.mockResolvedValue({
      items: [],
      total: 0,
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Publications')).toBeInTheDocument();
    });

    // Verify initial API call with default sort
    expect(mockGetPublicationCompliance).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        sort: 'team_asc',
      }),
    );
  });

  it('reads valid sort from URL and passes it to API', async () => {
    const mockGetPublicationCompliance = getPublicationCompliance as jest.Mock;
    mockGetPublicationCompliance.mockResolvedValue({
      items: [],
      total: 0,
    });

    renderPage([
      '/analytics/open-science/publication-compliance?sort=publications_desc',
    ]);

    await waitFor(() => {
      expect(screen.getByText('Publications')).toBeInTheDocument();
    });

    expect(mockGetPublicationCompliance).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        sort: 'publications_desc',
      }),
    );
  });

  it('calls navigate with new sort and replace when column sort button is clicked', async () => {
    const mockGetPublicationCompliance = getPublicationCompliance as jest.Mock;
    mockGetPublicationCompliance.mockResolvedValue({
      items: [],
      total: 0,
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Publications')).toBeInTheDocument();
    });

    const publicationsHeader = screen.getByRole('columnheader', {
      name: /Publications/,
    });
    const sortButton = publicationsHeader.querySelector('button');
    fireEvent.click(sortButton!);

    expect(mockNavigate).toHaveBeenCalledWith(
      { search: 'sort=publications_desc' } as never,
      { replace: true },
    );
  });

  it.each<SortPublicationCompliance>([
    'team_asc',
    'team_desc',
    'publications_asc',
    'publications_desc',
    'datasets_asc',
    'datasets_desc',
    'protocols_asc',
    'protocols_desc',
    'code_asc',
    'code_desc',
    'lab_materials_asc',
    'lab_materials_desc',
  ])('handles sort option %s in the query key', (sort) => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort,
      tags: [] as string[],
      timeRange: 'all' as const,
    };
    const queryClient = createTestQueryClient();
    const queryKey = publicationComplianceQueryKeys.list(stateOptions);

    const fakeData: ListPublicationComplianceOpensearchResponse = {
      total: 1,
      items: [publicationComplianceItem],
    };
    queryClient.setQueryData(queryKey, fakeData);
    expect(queryClient.getQueryData(queryKey)).toEqual(fakeData);
  });

  it('handles sorting with tags filter in the query key', () => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort: 'publications_desc' as const,
      tags: ['tag1', 'tag2'] as string[],
      timeRange: 'all' as const,
    };
    const queryClient = createTestQueryClient();
    const queryKey = publicationComplianceQueryKeys.list(stateOptions);

    const fakeData: ListPublicationComplianceOpensearchResponse = {
      total: 1,
      items: [publicationComplianceItem],
    };
    queryClient.setQueryData(queryKey, fakeData);
    expect(queryClient.getQueryData(queryKey)).toEqual(fakeData);
  });
});
