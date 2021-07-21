import { RecoilRoot } from 'recoil';
import { render, act } from '@testing-library/react';
import { useOnboardableContext } from '@asap-hub/react-context';
import { waitFor } from '@testing-library/dom';
import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';

import { Auth0Provider, WhenReady } from '../auth/test-utils';
import OnboardableWrapper from '../OnboardableWrapper';
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
      approach: 'a',
      responsibilities: 'a',
    },
  ],
  institution: 'a',
  jobTitle: 'a',
  city: 'a',
  country: 'a',
  skills: ['1', '2', '3', '4', '5'],
};

const TestComponent = () => {
  const { isOnboardable } = useOnboardableContext();
  return (
    <>
      isOnboardable:{' '}
      {isOnboardable === null ? 'null' : isOnboardable ? 'true' : 'false'}
    </>
  );
};
it('onboardable is null when there is no logged in user', async () => {
  const { container } = render(
    <RecoilRoot>
      <OnboardableWrapper>
        <TestComponent />
      </OnboardableWrapper>
    </RecoilRoot>,
  );
  expect(container.textContent).toMatchInlineSnapshot(`"isOnboardable: null"`);
});

it('onboardable is null when the logged in user is already onboarded', async () => {
  const { queryByText } = render(
    <RecoilRoot>
      <Auth0Provider user={{ onboarded: true }}>
        <WhenReady>
          <OnboardableWrapper>
            <TestComponent />
          </OnboardableWrapper>
        </WhenReady>
      </Auth0Provider>
    </RecoilRoot>,
  );
  await act(() =>
    waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument()),
  );
  expect(queryByText('isOnboardable: null')).toBeVisible();
});

let resolveUser!: (user: UserResponse) => void;
mockGetUser.mockImplementation(
  () =>
    new Promise((resolve) => {
      resolveUser = resolve;
    }),
);
it('onboardable is true when: logged in, not onboarded and conditions met', async () => {
  const { queryByText } = render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshUserState(onboardableUser.id), Math.random());
      }}
    >
      <Auth0Provider user={{ id: onboardableUser.id, onboarded: false }}>
        <OnboardableWrapper>
          <TestComponent />
        </OnboardableWrapper>
      </Auth0Provider>
    </RecoilRoot>,
  );
  await act(() =>
    waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument()),
  );
  expect(queryByText('isOnboardable: false')).toBeVisible();
  resolveUser(onboardableUser);
  await act(() => waitFor(() => expect(mockGetUser).toHaveBeenCalled()));
  expect(queryByText('isOnboardable: true')).toBeVisible();
});

it('onboardable is false when: logged in, not onboarded but conditions not met', async () => {
  const { queryByText } = render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshUserState(onboardableUser.id), Math.random());
      }}
    >
      <Auth0Provider user={{ id: onboardableUser.id, onboarded: false }}>
        <OnboardableWrapper>
          <TestComponent />
        </OnboardableWrapper>
      </Auth0Provider>
    </RecoilRoot>,
  );
  await act(() =>
    waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument()),
  );
  expect(queryByText('isOnboardable: false')).toBeVisible();
  resolveUser({
    ...onboardableUser,
    jobTitle: undefined,
  });
  await act(() => waitFor(() => expect(mockGetUser).toHaveBeenCalled()));
  expect(queryByText('isOnboardable: false')).toBeVisible();
});
