import { createListInterestGroupResponse } from '@asap-hub/fixtures';
import { ListInterestGroupResponse } from '@asap-hub/model';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';

import { getInterestGroups } from '../api';
import InterestGroupList from '../InterestGroupList';

jest.mock('../api');
jest.mock('../../users/api');
jest.mock('../../teams/api');
jest.mock('../../working-groups/api');

const mockGetInterestGroups = getInterestGroups as jest.MockedFunction<
  typeof getInterestGroups
>;

const renderInterestGroupList = async (
  listGroupResponse: ListInterestGroupResponse = createListInterestGroupResponse(),
) => {
  mockGetInterestGroups.mockResolvedValue(listGroupResponse);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  const result = render(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <MemoryRouter initialEntries={['/interest-groups/']}>
                <Routes>
                  <Route
                    path="/interest-groups"
                    element={<InterestGroupList filters={new Set()} />}
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

it('fetches the group information', async () => {
  await renderInterestGroupList();

  await waitFor(() =>
    expect(mockGetInterestGroups).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPage: 0,
      }),
      expect.anything(),
    ),
  );
});

it('renders a list of fetched groups', async () => {
  const { container } = await renderInterestGroupList({
    ...createListInterestGroupResponse(2),
    items: createListInterestGroupResponse(2).items.map((group, i) => ({
      ...group,
      name: `Group ${i}`,
    })),
  });
  expect(container.textContent).toContain('Group 0');
  expect(container.textContent).toContain('Group 1');
});

it('filters inactive group teams from team count', async () => {
  await renderInterestGroupList({
    ...createListInterestGroupResponse(1),
    items: createListInterestGroupResponse(1).items.map((group) => ({
      ...group,
      teams: [
        { ...group.teams[0]!, id: '1', inactiveSince: undefined },
        { ...group.teams[0]!, id: '2', inactiveSince: undefined },
        { ...group.teams[0]!, id: '3', inactiveSince: undefined },
        { ...group.teams[0]!, id: '4', inactiveSince: undefined },
      ],
    })),
  });
  expect(screen.getByText(/4 Teams/i)).toBeVisible();
  await renderInterestGroupList({
    ...createListInterestGroupResponse(1),
    items: createListInterestGroupResponse(1).items.map((group) => ({
      ...group,
      teams: [
        { ...group.teams[0]!, id: '1', inactiveSince: undefined },
        {
          ...group.teams[0]!,
          id: '2',
          inactiveSince: new Date().toISOString(),
        },
        { ...group.teams[0]!, id: '3', inactiveSince: undefined },
        {
          ...group.teams[0]!,
          id: '4',
          inactiveSince: new Date().toISOString(),
        },
      ],
    })),
  });
  expect(screen.getByText(/2 Teams/i)).toBeVisible();
});
