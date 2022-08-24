import { renderHook, act } from '@testing-library/react-hooks/server';
import { waitFor } from '@testing-library/dom';
import { network } from '@asap-hub/routing';
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
  expertiseAndResourceTags: [],
  teams: [],
  questions: [],
};

const wrapper =
  ({ user }: { user?: UserResponse }): React.FC =>
  ({ children }) =>
    (
      <RecoilRoot
        initializeState={({ set }) => {
          user?.id && set(refreshUserState(user.id), Math.random());
        }}
      >
        <Auth0Provider user={{ id: user?.id, onboarded: user?.onboarded }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                network({})
                  .users({})
                  .user({
                    userId: user?.id ?? '',
                  })
                  .research({}).$,
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
      expertiseAndResourceTags: ['1', '2', '3', '4', '5'],
    };
    mockGetUser.mockResolvedValue(user);

    const { result } = renderHook(() => useOnboarding(user.id), {
      wrapper: wrapper({ user }),
    });

    await act(async () => {
      await waitFor(() => {
        const [details, role, questions, bio] =
          result.current?.incompleteSteps ?? [];
        expect(details.modalHref).toBe(
          `/network/users/${user.id}/research/edit-personal-info`,
        );
        expect(role.modalHref).toBe(
          network({})
            .users({})
            .user({ userId: user.id })
            .research({})
            .editRole({}).$,
        );

        expect(questions.modalHref).toBe(
          network({})
            .users({})
            .user({ userId: user.id })
            .research({})
            .editQuestions({}).$,
        );

        expect(bio.modalHref).toBe(
          network({})
            .users({})
            .user({ userId: user.id })
            .about({})
            .editBiography({}).$,
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
        expertiseAndResourceTags: ['1', '2', '3', '4', '5'],
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
