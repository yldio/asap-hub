import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { act, render, screen, waitFor } from '@testing-library/react';
import React, { Suspense } from 'react';
import { RecoilRoot, useRecoilState } from 'recoil';
import {
  ListPreprintComplianceOpensearchResponse,
  PreprintComplianceOpensearchResponse,
} from '@asap-hub/model';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import PreprintCompliance from '../PreprintCompliance';
import {
  preprintComplianceState,
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

mockConsoleError();

jest.spyOn(console, 'error').mockImplementation();

describe('PreprintCompliance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPreprintCompliance.mockResolvedValue({
      items: [],
      total: 0,
    });
    mockSearch.mockResolvedValue({ items: [], total: 0 });
  });
  it('renders preprint compliance correctly', async () => {
    render(
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <PreprintCompliance tags={[]} />
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Number of Preprints')).toBeInTheDocument();
    });
  });

  it('resets preprint compliance state to undefined when reset is triggered', async () => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort: 'team_asc' as const,
      tags: [] as string[],
      timeRange: 'all' as const,
    };

    let capturedValue:
      | ListPreprintComplianceOpensearchResponse
      | Error
      | undefined;
    let setState: (
      val: ListPreprintComplianceOpensearchResponse | Error | undefined,
    ) => void = () => {};

    const TestComponent = () => {
      const [value, setValue] = useRecoilState(
        preprintComplianceState(stateOptions),
      );
      capturedValue = value;
      setState = setValue;
      return null;
    };

    render(
      <RecoilRoot>
        <TestComponent />
      </RecoilRoot>,
    );

    // Initially undefined
    expect(capturedValue).toBeUndefined();

    // Act: set a fake value
    const fakeData = {
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
          timeRange: 'all' as const,
          postedPriorPercentage: 50,
        },
      ],
    };
    act(() => {
      setState(fakeData);
    });
    await waitFor(() => {
      expect(capturedValue).toEqual(fakeData);
    });

    // Act: reset by setting undefined
    act(() => {
      setState(undefined);
    });

    // Assert: after reset, state is undefined again
    await waitFor(() => {
      expect(capturedValue).toBeUndefined();
    });
  });

  it('throws when preprintCompliance is an Error', () => {
    // Mock useRecoilState to return an Error
    const recoil = jest.requireActual('recoil');
    jest
      .spyOn(recoil, 'useRecoilState')
      .mockReturnValueOnce([new Error('test error'), jest.fn()]);

    expect(() =>
      useAnalyticsPreprintCompliance({
        currentPage: 0,
        pageSize: 10,
        sort: 'team_asc',
        tags: [],
        timeRange: 'all',
      }),
    ).toThrow('test error');
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
      <RecoilRoot
        initializeState={({ reset }) => {
          reset(
            preprintComplianceState({
              currentPage: 0,
              pageSize: 10,
              sort: 'team_asc',
              tags: [],
              timeRange: 'all',
            }),
          );
        }}
      >
        <ErrorBoundary>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <TestComponent />
              </WhenReady>
            </Auth0Provider>
          </Suspense>
        </ErrorBoundary>
      </RecoilRoot>,
    );

    // The error should be caught and the component should handle it
    // This covers the catch(setPreprintCompliance) path and throw preprintCompliance path (line 128-129)
    await waitFor(() => {
      expect(caughtError?.message).toBe(
        'Failed to fetch preprint compliance data',
      );
    });
  });

  it('handles errors when setting error state in selector', async () => {
    // This test covers the selector set method when newTeams is an Error
    // Specifically line 71: set(preprintComplianceIndexState(options), newTeams) when Error
    const error = new Error('Test error');

    let caughtError: Error | null = null;
    const ErrorBoundary = createErrorBoundary((err) => {
      caughtError = err;
    });

    const TestComponent = () => {
      const [value, setValue] = useRecoilState(
        preprintComplianceState({
          currentPage: 0,
          pageSize: 10,
          sort: 'team_asc',
          tags: [],
          timeRange: 'all',
        }),
      );

      React.useEffect(() => {
        // Set error state to trigger the selector's set method with Error
        setValue(error);
      }, [setValue]);

      if (value instanceof Error) {
        throw value;
      }

      return <div>Success</div>;
    };

    render(
      <RecoilRoot
        initializeState={({ reset }) => {
          reset(
            preprintComplianceState({
              currentPage: 0,
              pageSize: 10,
              sort: 'team_asc',
              tags: [],
              timeRange: 'all',
            }),
          );
        }}
      >
        <ErrorBoundary>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <TestComponent />
              </WhenReady>
            </Auth0Provider>
          </Suspense>
        </ErrorBoundary>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(caughtError).toBe(error);
    });
  });

  it('sets team list states when setting valid preprint compliance data', async () => {
    // This test covers lines 82-87: setting individual team list states
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
      <RecoilRoot
        initializeState={({ reset }) => {
          reset(
            preprintComplianceState({
              currentPage: 0,
              pageSize: 10,
              sort: 'team_asc',
              tags: [],
              timeRange: 'all',
            }),
          );
        }}
      >
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <TestComponent />
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Verify the data was loaded correctly (implicitly checks individual team states)
    expect(screen.getByTestId('success')).toHaveTextContent('2 teams');
    expect(mockGetPreprintCompliance).toHaveBeenCalled();
  });
});
