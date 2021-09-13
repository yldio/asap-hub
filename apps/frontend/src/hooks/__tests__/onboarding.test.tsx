import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/dom';
import { network } from '@asap-hub/routing';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { UserResponse, UserTeam } from '@asap-hub/model';
import { createUserResponse } from '@asap-hub/fixtures';

import { useOnboarding } from '../onboarding';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { refreshUserState } from '../../network/users/state';
import { getUser } from '../../network/users/api';

jest.mock('../../network/users/api');
const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;

const createUser = ({
  id = '1234',
  onboarded = false,
  biography = undefined,
  institution = undefined,
  jobTitle = undefined,
  city = undefined,
  country = undefined,
  questions = [],
  skills = [],
  teams = [],
}: {
  id?: string;
  institution?: string;
  jobTitle?: string;
  city?: string;
  country?: string;
  biography?: string;
  questions?: string[];
  skills?: string[];
  onboarded?: boolean;
  teams?: UserTeam[];
}): UserResponse => ({
  ...createUserResponse(),
  id,
  biography,
  questions,
  teams,
  institution,
  jobTitle,
  city,
  country,
  skills,
  onboarded,
});

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

  it('handles user undefines', async () => {
    mockGetUser.mockResolvedValue(undefined);

    const { result } = renderHook(() => useOnboarding(''), {
      wrapper: wrapper({ user: undefined }),
    });

    await act(async () => {
      await waitFor(() => {
        expect(result.current.steps).toBeUndefined();
        expect(result.current.isOnboardable).toBe(false);
      });
    });
  });

  it('calculates the steps needed to complete the profile', async () => {
    const user = createUser({ id: '1234' });
    mockGetUser.mockResolvedValue(user);

    const { result } = renderHook(() => useOnboarding(user.id), {
      wrapper: wrapper({ user }),
    });

    await act(async () => {
      await waitFor(() => {
        expect(
          Object.values(result.current.steps ?? {}).map(({ label }) => label),
        ).toEqual(['Details', 'Role', 'Expertise', 'Questions', 'Biography']);
      });
    });
  });

  it('returns the step in the correct order', async () => {
    const user = createUser({ id: '1234', questions: ['1', '2'] });
    mockGetUser.mockResolvedValue(user);

    const { result } = renderHook(() => useOnboarding(user.id), {
      wrapper: wrapper({ user }),
    });

    await act(async () => {
      await waitFor(() => {
        expect(
          Object.values(result.current.steps ?? {}).map(({ label }) => label),
        ).toEqual(['Details', 'Role', 'Expertise', 'Biography']);
      });
    });
  });

  it('calculates the modal href for every step', async () => {
    const user = createUser({ id: '1234', skills: ['1', '2', '3', '4', '5'] });
    mockGetUser.mockResolvedValue(user);

    const { result } = renderHook(() => useOnboarding(user.id), {
      wrapper: wrapper({ user }),
    });

    await act(async () => {
      await waitFor(() => {
        const [details, role, questions, bio] = Object.values(
          result.current.steps ?? {},
        );

        expect(details.modalHref).toBe(
          `/network/users/${user.id}/research/edit-personal-info`,
        );
        expect(role.modalHref).toBe(
          network({})
            .users({})
            .user({ userId: user.id })
            .research({})
            .editTeamMembership({ teamId: user.teams[0]?.id }).$,
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
});
