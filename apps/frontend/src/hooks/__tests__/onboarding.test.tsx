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
  ({ user }: { user: UserResponse }): React.FC =>
  ({ children }) =>
    (
      <RecoilRoot
        initializeState={({ set }) => {
          set(refreshUserState(user.id), Math.random());
        }}
      >
        <Auth0Provider user={{ id: user.id, onboarded: user.onboarded }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                network({})
                  .users({})
                  .user({
                    userId: user.id,
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
  it('calculates the modal href the required fields', async () => {
    const user = createUser({ id: '1234' });
    mockGetUser.mockResolvedValue(user);

    const { result } = renderHook(() => useOnboarding(user.id), {
      wrapper: wrapper({ user }),
    });

    await act(async () => {
      await waitFor(() => {
        expect(result.current.institution?.valid).toBe(false);
        expect(result.current.institution?.modalHref).toContain(
          `/network/users/${user.id}/research/edit-contact-info`,
        );

        expect(result.current.jobTitle?.valid).toBe(false);
        expect(result.current.jobTitle?.modalHref).toBe(
          `/network/users/${user.id}/research/edit-contact-info`,
        );

        expect(result.current.city?.valid).toBe(false);
        expect(result.current.city?.modalHref).toBe(
          `/network/users/${user.id}/research/edit-contact-info`,
        );

        expect(result.current.country?.valid).toBe(false);
        expect(result.current.country?.modalHref).toBe(
          `/network/users/${user.id}/research/edit-contact-info`,
        );

        expect(result.current.biography?.valid).toBe(false);
        expect(result.current.biography?.modalHref).toBe(
          network({})
            .users({})
            .user({ userId: user.id })
            .about({})
            .editBiography({}).$,
        );

        expect(result.current.skills?.valid).toBe(false);
        expect(result.current.skills?.modalHref).toBe(
          network({})
            .users({})
            .user({ userId: user.id })
            .research({})
            .editSkills({}).$,
        );

        expect(result.current.questions?.valid).toBe(false);
        expect(result.current.questions?.modalHref).toBe(
          network({})
            .users({})
            .user({ userId: user.id })
            .research({})
            .editQuestions({}).$,
        );

        expect(result.current.teams?.valid).toBe(false);
        expect(result.current.teams?.modalHref).toBe(
          network({})
            .users({})
            .user({ userId: user.id })
            .research({})
            .editTeamMembership({ teamId: user.teams[0]?.id }).$,
        );
      });
    });
  });
  it('calculates the modal href the required fieldssss', async () => {
    const user = createUser({
      id: '1234',
      institution: 'institution',
      questions: ['1', '2'],
      skills: ['A', 'B', 'C'],
    });

    mockGetUser.mockResolvedValue(user);

    const { result } = renderHook(() => useOnboarding(user.id), {
      wrapper: wrapper({ user }),
    });

    await act(async () => {
      await waitFor(() => {
        expect(result.current.institution).toBeUndefined();
        expect(result.current.questions).toBeUndefined();
        expect(result.current.questions).toBeUndefined();

        expect(result.current.skills).toBeDefined();
        expect(result.current.jobTitle).toBeDefined();
        expect(result.current.country).toBeDefined();
        expect(result.current.city).toBeDefined();
        expect(result.current.teams).toBeDefined();
      });
    });
  });
});
