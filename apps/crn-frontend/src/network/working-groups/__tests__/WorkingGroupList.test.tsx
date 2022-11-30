import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { createWorkingGroupListResponse } from '@asap-hub/fixtures';
import { WorkingGroupListResponse } from '@asap-hub/model';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';

import WorkingGroupList from '../WorkingGroupList';
import { getWorkingGroups } from '../api';
import { workingGroupsState } from '../state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';

jest.mock('../api');

const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
  typeof getWorkingGroups
>;

const renderGroupList = async (
  listWorkingGroupResponse: WorkingGroupListResponse = createWorkingGroupListResponse(
    1,
  ),
) => {
  mockGetWorkingGroups.mockResolvedValue(listWorkingGroupResponse);

  const result = render(
    <RecoilRoot
      initializeState={({ reset }) =>
        reset(
          workingGroupsState({
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
            <MemoryRouter initialEntries={['/working-groups/']}>
              <Route path="/working-groups" component={WorkingGroupList} />
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
    expect(mockGetWorkingGroups).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPage: 0,
      }),
      expect.anything(),
    ),
  );
});

it('renders a list of fetched working groups', async () => {
  const { container } = await renderGroupList({
    ...createWorkingGroupListResponse(2),
    items: createWorkingGroupListResponse(2).items.map((group, i) => ({
      ...group,
      title: `Working Group ${i}`,
    })),
  });
  expect(container.textContent).toContain('Working Group 0');
  expect(container.textContent).toContain('Working Group 1');
});
