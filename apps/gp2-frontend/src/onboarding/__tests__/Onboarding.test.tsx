import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router';
import { gp2 } from '@asap-hub/model';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUser } from '../../users/api';
import Onboarding from '../Onboarding';

jest.mock('../../users/api');

mockConsoleError();

const renderOnboarding = async (id: string) => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{ onboarded: false, id }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[gp2Routing.onboarding({}).coreDetails({}).$]}
            >
              <Onboarding />
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

describe('Onboarding', () => {
  beforeEach(jest.resetAllMocks);
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;

  it('has core details activated', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderOnboarding(user.id);
    expect(screen.getByRole('link', { name: /core details/i })).toHaveClass(
      'active',
    );
  });
  it('reaches publish link if user profile is completed', async () => {
    const user: gp2.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      onboarded: false,
      biography: 'bio',
    };
    mockGetUser.mockResolvedValueOnce(user);

    await renderOnboarding(user.id);
    await userEvent.click(screen.getByRole('link', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('link', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('link', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('link', { name: 'Continue' }));
    expect(screen.getByRole('link', { name: 'Publish' })).toBeVisible();
  });
});
