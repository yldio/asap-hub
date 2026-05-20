import { createWorkingGroupListResponse } from '@asap-hub/fixtures';
import { WorkingGroupListResponse } from '@asap-hub/model';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';

import WorkingGroupList from '../WorkingGroupList';
import { getWorkingGroups } from '../api';
import { workingGroupsState } from '../state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';

jest.mock('../api');
jest.mock('../../teams/api');
jest.mock('../../interest-groups/api');

const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
  typeof getWorkingGroups
>;

const renderWorkingGroupList = async (
  listWorkingGroupResponse: WorkingGroupListResponse = createWorkingGroupListResponse(),
) => {
  mockGetWorkingGroups.mockResolvedValue(listWorkingGroupResponse);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  const result = render(
    <QueryClientProvider client={queryClient}>
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
                <Routes>
                  <Route
                    path="/working-groups"
                    element={<WorkingGroupList filters={new Set()} />}
                  />
                </Routes>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('fetches the working group information', async () => {
  await renderWorkingGroupList();

  await waitFor(() =>
    expect(mockGetWorkingGroups).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        currentPage: 0,
      }),
    ),
  );
});

it('renders a list of fetched working groups', async () => {
  const { container } = await renderWorkingGroupList({
    ...createWorkingGroupListResponse(2),
    items: createWorkingGroupListResponse(2).items.map((group, i) => ({
      ...group,
      title: `Working Group ${i}`,
    })),
  });
  expect(container.textContent).toContain('Working Group 0');
  expect(container.textContent).toContain('Working Group 1');
});
