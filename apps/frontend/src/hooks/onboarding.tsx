import { isUserOnboardable, UserOnboardingResult } from '@asap-hub/validation';
import { network } from '@asap-hub/routing';

import { useUserByIdLoadable } from '../network/users/state';
import { useCurrentUserProfileTabRoute } from './current-user-profile-tab-route';

const validateOnboardingStep = ({
  fields,
  onboardingValidation,
}: {
  fields: string[];
  onboardingValidation: ReturnType<typeof isUserOnboardable>;
}) => fields.some((field) => Object.keys(onboardingValidation).includes(field));

export const useOnboarding = (id: string): UserOnboardingResult => {
  let invalidOnboardingSteps: { label: string; modalHref?: string }[] = [];

  const userById = useUserByIdLoadable(id);
  const profileTab = useCurrentUserProfileTabRoute();

  const user =
    userById.state === 'hasValue' && userById.contents
      ? userById.contents
      : undefined;

  const onboardingValidation = user
    ? isUserOnboardable(user)
    : { isOnboardable: false };

  if (!user) {
    return {
      isOnboardable: false,
    };
  }

  if (
    validateOnboardingStep({
      fields: ['institution', 'jobTitle', 'country', 'city'],
      onboardingValidation,
    })
  ) {
    invalidOnboardingSteps = [
      ...invalidOnboardingSteps,
      {
        label: 'Details',
        modalHref: profileTab?.({}).editPersonalInfo({}).$,
      },
    ];
  }

  if (
    validateOnboardingStep({
      fields: ['teams'],
      onboardingValidation,
    })
  ) {
    invalidOnboardingSteps = [
      ...invalidOnboardingSteps,
      {
        label: 'Role',
        modalHref: network({})
          .users({})
          .user({ userId: user.id })
          .research({})
          .editTeamMembership({ teamId: user.teams[0]?.id }).$,
      },
    ];
  }
  if (
    validateOnboardingStep({
      fields: ['skills'],
      onboardingValidation,
    })
  ) {
    invalidOnboardingSteps = [
      ...invalidOnboardingSteps,
      {
        label: 'Expertise',
        modalHref: network({})
          .users({})
          .user({ userId: user.id })
          .research({})
          .editSkills({}).$,
      },
    ];
  }

  if (
    validateOnboardingStep({
      fields: ['questions'],
      onboardingValidation,
    })
  ) {
    invalidOnboardingSteps = [
      ...invalidOnboardingSteps,
      {
        label: 'Questions',
        modalHref: network({})
          .users({})
          .user({ userId: user.id })
          .research({})
          .editQuestions({}).$,
      },
    ];
  }
  if (
    validateOnboardingStep({
      fields: ['biography'],
      onboardingValidation,
    })
  ) {
    invalidOnboardingSteps = [
      ...invalidOnboardingSteps,
      {
        label: 'Biography',
        modalHref: network({})
          .users({})
          .user({ userId: user.id })
          .about({})
          .editBiography({}).$,
      },
    ];
  }

  return {
    steps: invalidOnboardingSteps,
    isOnboardable: onboardingValidation.isOnboardable,
  };
};
