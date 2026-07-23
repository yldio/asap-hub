import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getWorkingGroupNetwork } from '../api';
import WorkingGroupList from '../WorkingGroupList';

jest.mock('../api');

const renderWorkingGroupsList = async () => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[gp2Routing.workingGroups({}).$]}>
              <Routes>
                <Route
                  path={gp2Routing.workingGroups.template}
                  element={<WorkingGroupList role={'operational'} />}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );
  await waitFor(
    () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    { timeout: 30_000 },
  );
};
beforeEach(() => {
  jest.resetAllMocks();
});

it('renders a list of operational working groups', async () => {
  const mockGetWorkingGroups = getWorkingGroupNetwork as jest.MockedFunction<
    typeof getWorkingGroupNetwork
  >;
  const firstGroup = gp2Fixtures.createWorkingGroupResponse({
    id: '42',
    title: 'Working Group 42',
  });
  const secondGroup = gp2Fixtures.createWorkingGroupResponse({
    id: '11',
    title: 'Working Group 11',
  });
  const response = {
    total: 2,
    items: [
      {
        role: 'operational' as const,
        workingGroups: [firstGroup, secondGroup],
      },
    ],
  };
  mockGetWorkingGroups.mockResolvedValue(response);
  await renderWorkingGroupsList();
  expect(
    screen.getByRole('heading', { name: 'Working Group 42' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Working Group 11' }),
  ).toBeInTheDocument();
});
