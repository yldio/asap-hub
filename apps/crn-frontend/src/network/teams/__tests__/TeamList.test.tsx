import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createListTeamResponse } from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import * as flags from '@asap-hub/flags';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { Frame } from '@asap-hub/frontend-utils';
import { TeamType } from '@asap-hub/model';

import Teams from '../TeamList';
import { getAlgoliaTeams } from '../api';
import { teamsState } from '../state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';

jest.mock('../api');
jest.mock('../../users/api');
jest.mock('../../interest-groups/api');
jest.mock('../../working-groups/api');

mockConsoleError();

const mockGetAlgoliaTeams = getAlgoliaTeams as jest.MockedFunction<
  typeof getAlgoliaTeams
>;

const renderTeamList = async (
  route: string,
  teamType: TeamType | 'all' = 'all',
) => {
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
              <Routes>
                <Route
                  path={route}
                  element={
                    <Frame title={null}>
                      <Teams filters={new Set()} />
                    </Frame>
                  }
                />
              </Routes>
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

describe.each([
  ['discovery-teams', '/network/discovery-teams', 'Discovery Team'],
  ['resource-teams', '/network/resource-teams', 'Resource Team'],
] as const)('%s', (teamTypeName, route, teamType) => {
  it('renders a list of teams information', async () => {
    jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
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

    const { container } = await renderTeamList(route, teamType);
    expect(container.textContent).toContain('Name Unknown 0');
    expect(container.textContent).toContain('Project Title Unknown 0');
    expect(container.textContent).toContain('Name Unknown 1');
    expect(container.textContent).toContain('Project Title Unknown 1');
  });

  it('calls API with correct teamType parameter', async () => {
    mockGetAlgoliaTeams.mockResolvedValue(createListTeamResponse(0));

    await renderTeamList(route, teamType);

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

    await renderTeamList(route, teamType);

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

  it('renders error message when the response is not a 2XX', async () => {
    const errorText = 'error fetching teams';
    mockGetAlgoliaTeams.mockRejectedValueOnce(new Error(errorText));

    const { findByText, getByText } = await renderTeamList(route, teamType);

    expect(await findByText(/Something went wrong/i)).toBeVisible();
    expect(getByText(errorText)).toBeVisible();
  });
});

it('throws error when route is invalid', async () => {
  const { findByText, getByText } = await renderTeamList(
    '/network/invalid-teams',
  );

  expect(await findByText(/Something went wrong/i)).toBeVisible();
  expect(getByText(/Invalid route/i)).toBeVisible();
});
