import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUser } from '../../users/api';
import Groups from '../Groups';

jest.mock('../../users/api');

mockConsoleError();

const renderGroups = async (id: string) => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{ onboarded: false, id }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[gp2Routing.onboarding({}).groups({}).$]}
            >
              <Routes>
                <Route
                  path={gp2Routing.onboarding({}).groups.template}
                  element={<Groups />}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
};
describe('Groups', () => {
  beforeEach(jest.resetAllMocks);
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;

  it('renders projects and working groups', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderGroups(user.id);
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Working Groups' }),
    ).toBeVisible();
  });

  it('renders not found if no user is returned', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);
    await renderGroups('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });
});
