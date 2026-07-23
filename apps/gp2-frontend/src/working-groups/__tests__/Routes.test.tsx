import { gp2 } from '@asap-hub/fixtures';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getWorkingGroupNetwork } from '../api';
import WorkingGroupRoutes from '../Routes';

const renderRoutes = async () => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/working-groups/operational']}>
              <Routes>
                <Route
                  path="/working-groups/*"
                  element={<WorkingGroupRoutes />}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );
  return waitFor(
    () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    { timeout: 30_000 },
  );
};

jest.mock('../api');
describe('Routes', () => {
  beforeEach(jest.resetAllMocks);
  it('renders a list of operational working groups', async () => {
    const mockGetWorkingGroups = getWorkingGroupNetwork as jest.MockedFunction<
      typeof getWorkingGroupNetwork
    >;
    const firstGroup = gp2.createWorkingGroupResponse({
      id: '42',
      title: 'Working Group 42',
    });
    const secondGroup = gp2.createWorkingGroupResponse({
      id: '11',
      title: 'Working Group 11',
    });
    mockGetWorkingGroups.mockResolvedValue({
      total: 1,
      items: [
        {
          role: 'operational',
          workingGroups: [firstGroup, secondGroup],
        },
      ],
    });
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Working Group 42' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Working Group 11' }),
    ).toBeInTheDocument();
  }, 30_000);
});
