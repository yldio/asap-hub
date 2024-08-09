import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/dom';
import { networkRoutes } from '@asap-hub/routing';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { UserResponse } from '@asap-hub/model';
import { createUserResponse } from '@asap-hub/fixtures';

import { useOnboarding } from '../onboarding';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { refreshUserState } from '../../network/users/state';
import { getUser } from '../../network/users/api';

jest.mock('../../network/users/api');
const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
const emptyUser: UserResponse = {
  ...createUserResponse(),
  onboarded: false,
  biography: undefined,
  institution: undefined,
  jobTitle: undefined,
  city: undefined,
  country: undefined,
  teams: [],
  questions: [],
};

const wrapper =
  ({
    user,
  }: {
    user?: UserResponse;
  }): React.FC<React.PropsWithChildren<unknown>> =>
  ({ children }) => (
    <RecoilRoot
      initializeState={({ set }) => {
        user?.id && set(refreshUserState(user.id), Math.random());
      }}
    >
      <Auth0Provider user={{ id: user?.id, onboarded: user?.onboarded }}>
        <WhenReady>
          <MemoryRouter
            initialEntries={[
              networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.buildPath({
                id: user?.id ?? '',
              }),
            ]}
          >
            {children}
          </MemoryRouter>
        </WhenReady>
      </Auth0Provider>
    </RecoilRoot>
  );

describe('useOnboarding', () => {
  beforeEach(() => mockGetUser.mockClear());

  it('handles when a user is not logged in', async () => {
    mockGetUser.mockResolvedValue(undefined);

    const { result } = renderHook(() => useOnboarding(''), {
      wrapper: wrapper({ user: undefined }),
    });

    await act(async () => {
      await waitFor(() => {
        expect(result.current).toEqual(undefined);
      });
    });
  });

  it('returns all steps required to complete the profile', async () => {
    const user = { ...emptyUser };
    mockGetUser.mockResolvedValue(user);

    const { result } = renderHook(() => useOnboarding(user.id), {
      wrapper: wrapper({ user }),
    });

    await act(async () => {
      await waitFor(() => {
        expect(
          (result.current?.incompleteSteps ?? []).map(({ label }) => label),
        ).toEqual(['Details', 'Role', 'Expertise', 'Questions', 'Biography']);
      });
    });
  });

  it('returns incomplete step in order', async () => {
    const user = { ...emptyUser, questions: ['1', '2'] };
    mockGetUser.mockResolvedValue(user);

    const { result } = renderHook(() => useOnboarding(user.id), {
      wrapper: wrapper({ user }),
    });

    await act(async () => {
      await waitFor(() => {
        expect(
          (result.current?.incompleteSteps ?? []).map(({ label }) => label),
        ).toEqual(['Details', 'Role', 'Expertise', 'Biography']);
      });
    });
  });

  it('calculates the modal href for every step', async () => {
    const user = {
      ...emptyUser,
      tags: [
        { id: 'cd7be4902', name: 'Expertise 1' },
        { id: 'cd7be4905', name: 'Expertise 2' },
        { id: 'cd7be4901', name: 'Expertise 3' },
        { id: 'cd7be4903', name: 'Expertise 4' },
        { id: 'cd7be4904', name: 'Expertise 5' },
      ],
    };
    mockGetUser.mockResolvedValue(user);

    const { result } = renderHook(() => useOnboarding(user.id), {
      wrapper: wrapper({ user }),
    });

    await act(async () => {
      await waitFor(() => {
        const [details, role, questions, bio] =
          result.current?.incompleteSteps ?? [];
        expect(details!.modalHref).toBe(
          `/network/users/${user.id}/research/edit-personal-info`,
        );
        expect(role!.modalHref).toBe(
          networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.EDIT_ROLE.buildPath({
            id: user.id,
          }),
        );
        expect(questions!.modalHref).toBe(
          networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.EDIT_QUESTIONS.buildPath(
            {
              id: user.id,
            },
          ),
        );
        expect(bio!.modalHref).toBe(
          networkRoutes.DEFAULT.USERS.DETAILS.ABOUT.EDIT_BIOGRAPHY.buildPath({
            id: user.id,
          }),
        );
      });
    });
  });
  describe('when user role is Staff', () => {
    it('returns all steps required to complete the profile', async () => {
      const user = { ...emptyUser, role: 'Staff' as const };
      mockGetUser.mockResolvedValue(user);

      const { result } = renderHook(() => useOnboarding(user.id), {
        wrapper: wrapper({ user }),
      });

      await act(async () => {
        await waitFor(() => {
          expect(
            (result.current?.incompleteSteps ?? []).map(({ label }) => label),
          ).toEqual(['Details', 'Role', 'Expertise', 'Biography']);
        });
      });
    });
    it('returns no incomplete steps if user has all information', async () => {
      const user = {
        ...emptyUser,
        role: 'Staff' as const,
        biography: 'my biography',
        institution: 'UCLA',
        jobTitle: 'PG',
        city: 'California',
        country: 'USA',
        responsibilities: '3pt Shooter',
      };
      mockGetUser.mockResolvedValue(user);

      const { result } = renderHook(() => useOnboarding(user.id), {
        wrapper: wrapper({ user }),
      });

      await act(async () => {
        await waitFor(() => {
          expect(
            (result.current?.incompleteSteps ?? []).map(({ label }) => label),
          ).toEqual([]);
        });
      });
    });
  });
});
