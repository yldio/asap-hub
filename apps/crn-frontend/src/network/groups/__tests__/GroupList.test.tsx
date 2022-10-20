import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { createListGroupResponse } from '@asap-hub/fixtures';
import { ListGroupResponse } from '@asap-hub/model';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';

import GroupList from '../GroupList';
import { getGroups } from '../api';
import { groupsState } from '../state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';

jest.mock('../api');
jest.mock('../../users/api');
jest.mock('../../teams/api');

const mockGetGroups = getGroups as jest.MockedFunction<typeof getGroups>;

const renderGroupList = async (
  listGroupResponse: ListGroupResponse = createListGroupResponse(),
) => {
  mockGetGroups.mockResolvedValue(listGroupResponse);

  const result = render(
    <RecoilRoot
      initializeState={({ reset }) =>
        reset(
          groupsState({
            currentPage: 0,
            pageSize: CARD_VIEW_PAGE_SIZE,
            filters: new Set(),
            searchQuery: '',
          }),
        )
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/groups/']}>
              <Route path="/groups" component={GroupList} />
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

it('fetches the group information', async () => {
  await renderGroupList();

  await waitFor(() =>
    expect(mockGetGroups).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPage: 0,
      }),
      expect.anything(),
    ),
  );
});

it('renders a list of fetched groups', async () => {
  const { container } = await renderGroupList({
    ...createListGroupResponse(2),
    items: createListGroupResponse(2).items.map((group, i) => ({
      ...group,
      name: `Group ${i}`,
    })),
  });
  expect(container.textContent).toContain('Group 0');
  expect(container.textContent).toContain('Group 1');
});

it('filters inactive group teams from team count', async () => {
  await renderGroupList({
    ...createListGroupResponse(1),
    items: createListGroupResponse(1).items.map((group) => ({
      ...group,
      teams: [
        { ...group.teams[0], id: '1', inactiveSince: undefined },
        { ...group.teams[0], id: '2', inactiveSince: undefined },
        { ...group.teams[0], id: '3', inactiveSince: undefined },
        { ...group.teams[0], id: '4', inactiveSince: undefined },
      ],
    })),
  });
  expect(screen.getByText(/4 Teams/i)).toBeVisible();
  await renderGroupList({
    ...createListGroupResponse(1),
    items: createListGroupResponse(1).items.map((group) => ({
      ...group,
      teams: [
        { ...group.teams[0], id: '1', inactiveSince: undefined },
        { ...group.teams[0], id: '2', inactiveSince: new Date().toISOString() },
        { ...group.teams[0], id: '3', inactiveSince: undefined },
        { ...group.teams[0], id: '4', inactiveSince: new Date().toISOString() },
      ],
    })),
  });
  expect(screen.getByText(/2 Teams/i)).toBeVisible();
});
