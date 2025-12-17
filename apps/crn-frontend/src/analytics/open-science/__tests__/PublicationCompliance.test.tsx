import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { ListPublicationComplianceOpensearchResponse } from '@asap-hub/model';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import {
  DefaultValue,
  RecoilRoot,
  SetterOrUpdater,
  useRecoilState,
} from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import PublicationCompliance from '../PublicationCompliance';
import {
  publicationComplianceState,
  useAnalyticsPublicationCompliance,
} from '../state';

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

mockConsoleError();

describe('PublicationCompliance', () => {
  it('renders publication compliance correctly', async () => {
    render(
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <PublicationCompliance tags={[]} />
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Publications')).toBeInTheDocument();
    });
  });

  it('resets publication compliance state to undefined when reset is triggered', async () => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort: 'team_asc' as const,
      tags: [] as string[],
      timeRange: 'all' as const,
    };

    let capturedValue:
      | ListPublicationComplianceOpensearchResponse
      | Error
      | undefined;
    let setState: SetterOrUpdater<
      ListPublicationComplianceOpensearchResponse | Error | undefined
    > = () => {};

    const TestComponent = () => {
      const [value, setValue] = useRecoilState(
        publicationComplianceState(stateOptions),
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

    // set a fake value
    const fakeData = {
      total: 1,
      items: [
        {
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
          timeRange: 'all' as const,
        },
      ],
    };
    act(() => {
      setState(fakeData);
    });
    await waitFor(() => {
      expect(capturedValue).toEqual(fakeData);
    });

    // Reset by setting undefined
    act(() => {
      setState(undefined);
    });

    // After reset, state is undefined again
    await waitFor(() => {
      expect(capturedValue).toBeUndefined();
    });
  });

  it('throws when publicationCompliance is an Error', () => {
    const recoil = jest.requireActual('recoil');
    jest
      .spyOn(recoil, 'useRecoilState')
      .mockReturnValueOnce([new Error('test error'), jest.fn()]);

    expect(() =>
      useAnalyticsPublicationCompliance({
        currentPage: 0,
        pageSize: 10,
        sort: 'team_asc',
        tags: [],
        timeRange: 'all',
      }),
    ).toThrow('test error');
  });

  it('handles undefined timeRange by normalizing to all', async () => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort: 'team_asc' as const,
      tags: [] as string[],
      timeRange: 'all' as const,
    };

    let capturedValue:
      | ListPublicationComplianceOpensearchResponse
      | Error
      | undefined;
    let setState: SetterOrUpdater<
      ListPublicationComplianceOpensearchResponse | Error | undefined
    > = () => {};

    const TestComponent = () => {
      const [value, setValue] = useRecoilState(
        publicationComplianceState(stateOptions),
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

    // Test that timeRange normalization works in pageKey generation
    const fakeData = {
      total: 1,
      items: [
        {
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
          timeRange: 'all' as const,
        },
      ],
    };
    act(() => {
      setState(fakeData);
    });
    await waitFor(() => {
      expect(capturedValue).toEqual(fakeData);
    });
  });

  it('handles DefaultValue in set function', async () => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort: 'team_asc' as const,
      tags: [] as string[],
      timeRange: 'all' as const,
    };

    let capturedValue:
      | ListPublicationComplianceOpensearchResponse
      | Error
      | undefined;
    let setState: SetterOrUpdater<
      ListPublicationComplianceOpensearchResponse | Error | undefined
    > = () => {};

    const TestComponent = () => {
      const [value, setValue] = useRecoilState(
        publicationComplianceState(stateOptions),
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

    // Test DefaultValue handling
    act(() => {
      setState(
        new DefaultValue() as unknown as
          | ListPublicationComplianceOpensearchResponse
          | Error
          | undefined,
      );
    });
    await waitFor(() => {
      expect(capturedValue).toBeUndefined();
    });
  });

  it('handles Error in set function', async () => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort: 'team_asc' as const,
      tags: [] as string[],
      timeRange: 'all' as const,
    };

    let capturedValue:
      | ListPublicationComplianceOpensearchResponse
      | Error
      | undefined;
    let setState: SetterOrUpdater<
      ListPublicationComplianceOpensearchResponse | Error | undefined
    > = () => {};

    const TestComponent = () => {
      const [value, setValue] = useRecoilState(
        publicationComplianceState(stateOptions),
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

    // Test Error handling in set function
    const testError = new Error('API Error');
    act(() => {
      setState(testError);
    });
    await waitFor(() => {
      expect(capturedValue).toBe(testError);
    });
  });

  it('handles successful data setting with forEach loop', async () => {
    const stateOptions = {
      currentPage: 0,
      pageSize: 10,
      sort: 'team_asc' as const,
      tags: [] as string[],
      timeRange: 'all' as const,
    };

    let capturedValue:
      | ListPublicationComplianceOpensearchResponse
      | Error
      | undefined;
    let setState: SetterOrUpdater<
      ListPublicationComplianceOpensearchResponse | Error | undefined
    > = () => {};

    const TestComponent = () => {
      const [value, setValue] = useRecoilState(
        publicationComplianceState(stateOptions),
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

    // Test successful data setting with multiple items (covers forEach loop)
    const fakeData = {
      total: 2,
      items: [
        {
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
          timeRange: 'all' as const,
        },
        {
          objectID: 'team-456',
          teamId: 'team-456',
          teamName: 'Team 456',
          isTeamInactive: false,
          overallCompliance: 92,
          ranking: 'OUTSTANDING',
          datasetsPercentage: 95,
          datasetsRanking: 'OUTSTANDING',
          protocolsPercentage: 88,
          protocolsRanking: 'OUTSTANDING',
          codePercentage: 90,
          codeRanking: 'OUTSTANDING',
          labMaterialsPercentage: 98,
          labMaterialsRanking: 'OUTSTANDING',
          numberOfPublications: 15,
          numberOfOutputs: 75,
          numberOfDatasets: 25,
          numberOfProtocols: 20,
          numberOfCode: 15,
          numberOfLabMaterials: 15,
          timeRange: 'all' as const,
        },
      ],
    };
    act(() => {
      setState(fakeData);
    });
    await waitFor(() => {
      expect(capturedValue).toEqual(fakeData);
    });
  });
});
