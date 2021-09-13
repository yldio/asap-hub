import { isUserOnboardable, UserOnboardingResult } from '@asap-hub/validation';
import { network } from '@asap-hub/routing';

import { useUserByIdLoadable } from '../network/users/state';
import { useCurrentUserProfileTabRoute } from './current-user-profile-tab-route';

const isValidStep = ({
  fields,
  response,
}: {
  fields: string[];
  response: ReturnType<typeof isUserOnboardable>;
}) => fields.some((field) => Object.keys(response).includes(field));

const isStepDetailsValid = (response: ReturnType<typeof isUserOnboardable>) =>
  isValidStep({
    fields: ['institution', 'jobTitle', 'country', 'city'],
    response,
  });

const isStepRoleValid = (response: ReturnType<typeof isUserOnboardable>) =>
  isValidStep({
    fields: ['teams'],
    response,
  });

const isStepSkillsValid = (response: ReturnType<typeof isUserOnboardable>) =>
  isValidStep({
    fields: ['skills'],
    response,
  });

const isStepQuestionsValid = (response: ReturnType<typeof isUserOnboardable>) =>
  isValidStep({
    fields: ['questions'],
    response,
  });

const isStepBioValid = (response: ReturnType<typeof isUserOnboardable>) =>
  isValidStep({
    fields: ['biography'],
    response,
  });

export const useOnboarding = (id: string): UserOnboardingResult => {
  let steps: { label: string; modalHref?: string }[] = [];

  const userById = useUserByIdLoadable(id);
  const profileTab = useCurrentUserProfileTabRoute();

  const user =
    userById.state === 'hasValue' && userById.contents
      ? userById.contents
      : undefined;

  const onboardingValidation = user
    ? isUserOnboardable(user)
    : { isOnboardable: false };

  if (isStepDetailsValid(onboardingValidation)) {
    steps = [
      ...steps,
      {
        label: 'Details',
        modalHref: profileTab
          ? profileTab({}).editContactInfo({}).$
          : undefined,
      },
    ];
  }

  if (isStepRoleValid(onboardingValidation)) {
    steps = [
      ...steps,
      {
        label: 'Role',
        modalHref: user
          ? network({})
              .users({})
              .user({ userId: user.id })
              .research({})
              .editTeamMembership({ teamId: user.teams[0]?.id }).$
          : undefined,
      },
    ];
  }
  if (isStepSkillsValid(onboardingValidation)) {
    steps = [
      ...steps,
      {
        label: 'Expertise',
        modalHref: user
          ? network({})
              .users({})
              .user({ userId: user.id })
              .research({})
              .editSkills({}).$
          : undefined,
      },
    ];
  }

  if (isStepQuestionsValid(onboardingValidation)) {
    steps = [
      ...steps,
      {
        label: 'Questions',
        modalHref: user
          ? network({})
              .users({})
              .user({ userId: user.id })
              .research({})
              .editQuestions({}).$
          : undefined,
      },
    ];
  }
  if (isStepBioValid(onboardingValidation)) {
    steps = [
      ...steps,
      {
        label: 'Biography',
        modalHref: user
          ? network({})
              .users({})
              .user({ userId: user.id })
              .about({})
              .editBiography({}).$
          : undefined,
      },
    ];
  }

  return {
    steps,
    isOnboardable: onboardingValidation.isOnboardable,
  };
};
