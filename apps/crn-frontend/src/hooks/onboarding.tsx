import { ComponentProps } from 'react';
import { isUserOnboardable } from '@asap-hub/validation';
import { networkRoutes } from '@asap-hub/routing';
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

const staffOrderedSteps = [
  'Details',
  'Role',
  'Expertise',
  'Biography',
] as const;

const fieldToStep: Record<
  keyof Omit<ReturnType<typeof isUserOnboardable>, 'isOnboardable'>,
  (typeof orderedSteps)[number] | (typeof staffOrderedSteps)[number]
> = {
  city: 'Details',
  institution: 'Details',
  country: 'Details',
  jobTitle: 'Details',
  biography: 'Biography',
  questions: 'Questions',
  tags: 'Expertise',
  teams: 'Role',
  researchInterests: 'Role',
  responsibilities: 'Role',
};
const staffSteps = (
  profileTab: NonNullable<ReturnType<typeof useCurrentUserProfileTabRoute>>,
  user: User,
): Record<
  (typeof staffOrderedSteps)[number],
  { modalHref: string; label: string }
> => ({
  Details: {
    label: 'Details',
    modalHref: profileTab.buildPath({ id: user.id }),
    // TODO: fix
    // EDIT_PERSONAL_INFO.buildPath({ id: user.id }),
  },
  Role: {
    label: 'Role',
    modalHref: networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.EDIT_ROLE.buildPath(
      { id: user.id },
    ),
  },
  Expertise: {
    label: 'Expertise',
    modalHref:
      networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.EDIT_EXPERTISE_AND_RESOURCES.buildPath(
        { id: user.id },
      ),
  },
  Biography: {
    label: 'Biography',
    modalHref:
      networkRoutes.DEFAULT.USERS.DETAILS.ABOUT.EDIT_BIOGRAPHY.buildPath({
        id: user.id,
      }),
  },
});
const defaultSteps = (
  profileTab: NonNullable<ReturnType<typeof useCurrentUserProfileTabRoute>>,
  user: User,
): Record<
  (typeof orderedSteps)[number],
  { modalHref: string; label: string }
> => ({
  Details: {
    label: 'Details',
    modalHref: profileTab.buildPath({ id: user.id }),
    // TODO: fix
    // EDIT_PERSONAL_INFO.buildPath({ id: user.id }),
  },
  Role: {
    label: 'Role',
    modalHref: networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.EDIT_ROLE.buildPath(
      { id: user.id },
    ),
  },
  Expertise: {
    label: 'Expertise',
    modalHref:
      networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.EDIT_EXPERTISE_AND_RESOURCES.buildPath(
        { id: user.id },
      ),
  },
  Questions: {
    label: 'Questions',
    modalHref:
      networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.EDIT_QUESTIONS.buildPath({
        id: user.id,
      }),
  },
  Biography: {
    label: 'Biography',
    modalHref:
      networkRoutes.DEFAULT.USERS.DETAILS.ABOUT.EDIT_BIOGRAPHY.buildPath({
        id: user.id,
      }),
  },
});

export const useOnboarding = (id: string): UserOnboardingResult | undefined => {
  const user = useUserById(id);
  const profileTab = useCurrentUserProfileTabRoute();

  if (!user || !profileTab) {
    return undefined;
  }
  const { isOnboardable, ...onboardingValidation } = isUserOnboardable(user);

  if (user.role === 'Staff') {
    return {
      isOnboardable,
      totalSteps: Object.keys(staffSteps(profileTab, user)).length,
      incompleteSteps: staffOrderedSteps.reduce<
        UserOnboardingResult['incompleteSteps']
      >((acc, stepKey) => {
        const fieldsToCheck = Object.entries(fieldToStep)
          .filter(([, step]) => step === stepKey)
          .map(([field]) => field);

        return fieldsToCheck.some((field) =>
          Object.keys(onboardingValidation).includes(field),
        )
          ? [...acc, staffSteps(profileTab, user)[stepKey]]
          : acc;
      }, []),
    };
  }

  return {
    isOnboardable,
    totalSteps: Object.keys(defaultSteps(profileTab, user)).length,
    incompleteSteps: orderedSteps.reduce<
      UserOnboardingResult['incompleteSteps']
    >((acc, stepKey) => {
      const fieldsToCheck = Object.entries(fieldToStep)
        .filter(([, step]) => step === stepKey)
        .map(([field]) => field);

      return fieldsToCheck.some((field) =>
        Object.keys(onboardingValidation).includes(field),
      )
        ? [...acc, defaultSteps(profileTab, user)[stepKey]]
        : acc;
    }, []),
  };
};
