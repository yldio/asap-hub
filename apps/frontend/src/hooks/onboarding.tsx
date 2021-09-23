import { ComponentProps } from 'react';
import { isUserOnboardable } from '@asap-hub/validation';
import { network } from '@asap-hub/routing';
import { User } from '@auth0/auth0-spa-js';
import { OnboardingFooter } from '@asap-hub/react-components';

import { useUserById } from '../network/users/state';
import { useCurrentUserProfileTabRoute } from './current-user-profile-tab-route';

export type UserOnboardingResult = NonNullable<
  ComponentProps<typeof OnboardingFooter>['onboardable']
>;
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

export const useOnboarding = (id: string): UserOnboardingResult | undefined => {
  const user = useUserById(id);
  const profileTab = useCurrentUserProfileTabRoute();
  if (!user || !profileTab) {
    return undefined;
  }
  const { isOnboardable, ...onboardingValidation } = isUserOnboardable(user);
  const stepDetails = steps(profileTab, user);

  return {
    isOnboardable,
    totalSteps: Object.keys(stepDetails).length,
    incompleteSteps: orderedSteps.reduce<
      UserOnboardingResult['incompleteSteps']
    >((acc, stepKey) => {
      const fieldsToCheck = Object.entries(fieldToStep)
        .filter(([, step]) => step === stepKey)
        .map(([field]) => field);

      return fieldsToCheck.some((field) =>
        Object.keys(onboardingValidation).includes(field),
      )
        ? [...acc, stepDetails[stepKey]]
        : acc;
    }, []),
  };
};
