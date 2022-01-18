import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { render, act } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { createUserResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { UserResponse } from '@asap-hub/model';
import { Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../auth/test-utils';
import Onboardable from '../Onboardable';
import { getUser } from '../network/users/api';
import { refreshUserState } from '../network/users/state';

jest.mock('../network/users/api');
const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
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
  expertiseAndResourceTags: ['1', '2', '3', '4', '5'],
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
  <RecoilRoot
    initializeState={({ set }) => {
      set(refreshUserState(onboardableUser.id), Math.random());
    }}
  >
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
  const { queryByText } = render(renderOnboardable(true));
  await act(() =>
    waitFor(() =>
      expect(queryByText('isOnboardable: undefined')).toBeVisible(),
    ),
  );
});

it('is true when: logged in, not onboarded and conditions met', async () => {
  mockGetUser.mockResolvedValue(onboardableUser);
  const { queryByText } = render(renderOnboardable(false));
  await act(() =>
    waitFor(() => {
      expect(mockGetUser).toHaveBeenCalled();
      expect(queryByText('isOnboardable: true')).toBeVisible();
    }),
  );
});

it('is false when: logged in, not onboarded but conditions not met', async () => {
  mockGetUser.mockResolvedValue({
    ...onboardableUser,
    jobTitle: undefined,
  });
  const { queryByText } = render(renderOnboardable(false));
  await act(() =>
    waitFor(() => {
      expect(mockGetUser).toHaveBeenCalled();
      expect(queryByText('isOnboardable: false')).toBeVisible();
    }),
  );
});
