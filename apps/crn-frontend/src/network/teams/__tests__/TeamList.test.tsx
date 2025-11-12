import React, { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { createListTeamResponse } from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';

import Teams from '../TeamList';
import { getAlgoliaTeams } from '../api';
import { teamsState } from '../state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';

jest.mock('../api');
jest.mock('../../users/api');
jest.mock('../../interest-groups/api');
jest.mock('../../working-groups/api');

const mockGetAlgoliaTeams = getAlgoliaTeams as jest.MockedFunction<
  typeof getAlgoliaTeams
>;

describe.each([
  ['discovery-teams', '/network/discovery-teams', 'Discovery Team'],
  ['resource-teams', '/network/resource-teams', 'Resource Team'],
] as const)('%s', (teamTypeName, route, teamType) => {
  const renderTeamList = async () => {
    const result = render(
      <RecoilRoot
        initializeState={({ reset }) => {
          reset(
            teamsState({
              currentPage: 0,
              pageSize: CARD_VIEW_PAGE_SIZE,
              filters: new Set(),
              searchQuery: '',
              teamType,
            }),
          );
        }}
      >
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <MemoryRouter initialEntries={[route]}>
                <Route path={route} component={Teams} />
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

  it('renders a list of teams information', async () => {
    const response = createListTeamResponse(2);

    mockGetAlgoliaTeams.mockResolvedValue({
      ...response,
      items: response.items.map((item, index) => ({
        ...item,
        displayName: `Name Unknown ${index}`,
        projectTitle: `Project Title Unknown ${index}`,
        teamType,
      })),
    });

    const { container } = await renderTeamList();
    expect(container.textContent).toContain('Name Unknown 0');
    expect(container.textContent).toContain('Project Title Unknown 0');
    expect(container.textContent).toContain('Name Unknown 1');
    expect(container.textContent).toContain('Project Title Unknown 1');
  });

  it('calls API with correct teamType parameter', async () => {
    mockGetAlgoliaTeams.mockResolvedValue(createListTeamResponse(0));

    await renderTeamList();

    await waitFor(() => {
      expect(mockGetAlgoliaTeams).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          teamType,
        }),
      );
    });
  });

  it('prefetches the opposite team type', async () => {
    mockGetAlgoliaTeams.mockResolvedValue(createListTeamResponse(0));

    await renderTeamList();

    const oppositeTeamType =
      teamType === 'Resource Team' ? 'Discovery Team' : 'Resource Team';

    await waitFor(() => {
      expect(mockGetAlgoliaTeams).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          teamType: oppositeTeamType,
          currentPage: 0,
          searchQuery: '',
        }),
      );
    });
  });
});

it('throws error when route is invalid', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation();

  const ErrorBoundary = class extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    render() {
      if (this.state.hasError) {
        return <div>Error: {this.state.error?.message}</div>;
      }
      return this.props.children;
    }
  };

  const { getByText } = render(
    <ErrorBoundary>
      <RecoilRoot
        initializeState={({ reset }) => {
          reset(
            teamsState({
              currentPage: 0,
              pageSize: CARD_VIEW_PAGE_SIZE,
              filters: new Set(),
              searchQuery: '',
              teamType: 'all',
            }),
          );
        }}
      >
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <MemoryRouter initialEntries={['/network/invalid-teams']}>
                <Route path="/network/invalid-teams" component={Teams} />
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>
    </ErrorBoundary>,
  );

  await waitFor(() => {
    expect(getByText(/Error: Invalid route/i)).toBeInTheDocument();
  });

  spy.mockRestore();
});
