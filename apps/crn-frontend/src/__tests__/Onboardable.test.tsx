import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor, screen } from '@testing-library/react';
import { createUserResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { UserResponse } from '@asap-hub/model';
import { Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../auth/test-utils';
import Onboardable from '../Onboardable';
import { getUser } from '../network/users/api';

jest.mock('../network/users/api');
const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;

// Suppress act() warnings from Recoil state updates
// eslint-disable-next-line no-console
const originalError = console.error;
beforeAll(() => {
  // eslint-disable-next-line no-console
  console.error = jest.fn((...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes(
        'The current testing environment is not configured to support act(...)',
      )
    ) {
      return;
    }
    originalError(...args);
  }) as typeof console.error;
});

afterAll(() => {
  // eslint-disable-next-line no-console
  console.error = originalError;
});

beforeEach(() => {
  mockGetUser.mockReset();
});
const onboardableUser: UserResponse = {
  ...createUserResponse(),
  questions: ['1', '2'],
  teams: [
    {
      id: 'a',
      role: 'Co-PI (Core Leadership)',
    },
  ],
  institution: 'a',
  jobTitle: 'a',
  city: 'a',
  country: 'a',
  tags: [
    { id: 'cd7be4902', name: 'Expertise 1' },
    { id: 'cd7be4905', name: 'Expertise 2' },
    { id: 'cd7be4901', name: 'Expertise 3' },
    { id: 'cd7be4903', name: 'Expertise 4' },
    { id: 'cd7be4904', name: 'Expertise 5' },
  ],
  biography: 'Biography',
  researchInterests: 'a',
  responsibilities: 'a',
};

it('is undefined when there is no logged in user', async () => {
  const { container } = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Onboardable>
          {(onboardable) => `onboardable: ${onboardable}`}
        </Onboardable>
      </Suspense>
    </RecoilRoot>,
  );
  expect(container.textContent).toMatchInlineSnapshot(
    `"onboardable: undefined"`,
  );
});

const renderOnboardable = (onboarded: boolean) => (
  <RecoilRoot>
    <Suspense fallback="loading">
      <Auth0Provider user={{ id: onboardableUser.id, onboarded }}>
        <WhenReady>
          <MemoryRouter
            initialEntries={[
              network({})
                .users({})
                .user({ userId: onboardableUser.id })
                .about({}).$,
            ]}
          >
            <Onboardable>
              {(onboardable) => `isOnboardable: ${onboardable?.isOnboardable}`}
            </Onboardable>
          </MemoryRouter>
        </WhenReady>
      </Auth0Provider>
    </Suspense>
  </RecoilRoot>
);

it('is undefined when the logged in user is already onboarded', async () => {
  render(renderOnboardable(true));

  // Then check for the expected text
  await waitFor(() => {
    expect(screen.getByText('isOnboardable: undefined')).toBeVisible();
  });
});

it('is true when: logged in, not onboarded and conditions met', async () => {
  mockGetUser.mockResolvedValue(onboardableUser);
  render(renderOnboardable(false));

  // Then wait for the API call and result
  await waitFor(() => {
    expect(mockGetUser).toHaveBeenCalled();
    expect(screen.getByText('isOnboardable: true')).toBeVisible();
  });
});

it('is false when: logged in, not onboarded but conditions not met', async () => {
  mockGetUser.mockResolvedValue({
    ...onboardableUser,
    jobTitle: undefined,
  });
  render(renderOnboardable(false));
  // Then wait for the API call and result
  await waitFor(() => {
    expect(mockGetUser).toHaveBeenCalled();
    expect(screen.getByText('isOnboardable: false')).toBeVisible();
  });
});
