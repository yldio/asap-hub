import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot, useRecoilState } from 'recoil';
import { ListPreprintComplianceOpensearchResponse } from '@asap-hub/model';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import PreprintCompliance from '../PreprintCompliance';
import {
  preprintComplianceState,
  useAnalyticsPreprintCompliance,
} from '../state';

jest.mock('../api', () => ({
  getPreprintCompliance: jest.fn().mockResolvedValue({
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

mockConsoleError();

describe('PreprintCompliance', () => {
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
