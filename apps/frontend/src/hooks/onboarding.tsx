import { isUserOnboardable, UserOnboardingResult } from '@asap-hub/validation';
import { network } from '@asap-hub/routing';
import { User } from '@auth0/auth0-spa-js';

import { useUserByIdLoadable } from '../network/users/state';
import { useCurrentUserProfileTabRoute } from './current-user-profile-tab-route';

const orderedSteps = [
  'Details',
  'Role',
  'Expertise',
  'Questions',
  'Biography',
] as const;

const fieldToStep: Record<
  keyof Omit<ReturnType<typeof isUserOnboardable>, 'isOnboardable'>,
  typeof orderedSteps[number]
> = {
  city: 'Details',
  institution: 'Details',
  country: 'Details',
  jobTitle: 'Details',
  biography: 'Biography',
  questions: 'Questions',
  skills: 'Expertise',
  teams: 'Role',
};

const steps = (
  profileTab: NonNullable<ReturnType<typeof useCurrentUserProfileTabRoute>>,
  user: User,
): Record<
  typeof orderedSteps[number],
  { modalHref: string; label: string }
> => ({
  Details: {
    label: 'Details',
    modalHref: profileTab({}).editPersonalInfo({}).$,
  },
  Role: {
    label: 'Role',
    modalHref: network({})
      .users({})
      .user({ userId: user.id })
      .research({})
      .editTeamMembership({ teamId: user.teams[0]?.id }).$,
  },
  Expertise: {
    label: 'Expertise',
    modalHref: network({})
      .users({})
      .user({ userId: user.id })
      .research({})
      .editSkills({}).$,
  },
  Questions: {
    label: 'Questions',
    modalHref: network({})
      .users({})
      .user({ userId: user.id })
      .research({})
      .editQuestions({}).$,
  },
  Biography: {
    label: 'Biography',
    modalHref: network({})
      .users({})
      .user({ userId: user.id })
      .about({})
      .editBiography({}).$,
  },
});

export const useOnboarding = (id: string): UserOnboardingResult => {
  const userById = useUserByIdLoadable(id);
  const profileTab = useCurrentUserProfileTabRoute();
  const user =
    userById.state === 'hasValue' && userById.contents
      ? userById.contents
      : undefined;

  if (!user || !profileTab) {
    return {
      steps: [],
      isOnboardable: false,
    };
  }
  const { isOnboardable, ...onboardingValidation } = isUserOnboardable(user);
  const stepDetails = steps(profileTab, user);

  return {
    steps: orderedSteps.reduce((acc, stepKey) => {
      const fieldsToCheck = Object.entries(fieldToStep)
        .filter(([_, step]) => step === stepKey)
        .map(([field]) => field);

      return fieldsToCheck.some((field) =>
        Object.keys(onboardingValidation).includes(field),
      )
        ? [...acc, stepDetails[stepKey]]
        : acc;
    }, [] as UserOnboardingResult['steps']),
    isOnboardable,
  };
};
