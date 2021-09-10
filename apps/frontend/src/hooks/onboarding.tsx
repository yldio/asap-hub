import { isUserOnboardable } from '@asap-hub/validation';
import { network } from '@asap-hub/routing';

import { useUserByIdLoadable } from '../network/users/state';
import { useCurrentUserProfileTabRoute } from './current-user-profile-tab-route';

export type OnboardingStep = {
  id: string;
  label: string;
  fields: string[];
  modalHref?: string;
};

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'details',
    label: 'Details',
    fields: ['institution', 'jobTitle', 'country', 'city'],
  },
  { id: 'role', label: 'Role', fields: ['teams'] },
  { id: 'skills', label: 'Expertise', fields: ['skills'] },
  { id: 'questions', label: 'Questions', fields: ['questions'] },
  { id: 'bio', label: 'Biography', fields: ['biography'] },
];

const updateStep = (
  step: OnboardingStep,
  response: ReturnType<typeof isUserOnboardable>,
  modalHref?: string,
) =>
  step.fields.some((field) => Object.keys(response).includes(field))
    ? { ...step, modalHref }
    : step;

export const useOnboarding = (
  id: string,
): { steps: OnboardingStep[]; isOnboardable: boolean } => {
  const userById = useUserByIdLoadable(id);
  const profileTab = useCurrentUserProfileTabRoute();

  const user =
    userById.state === 'hasValue' && userById.contents
      ? userById.contents
      : undefined;

  const onboardingValidation = user
    ? isUserOnboardable(user)
    : { isOnboardable: false };

  const steps = onboardingSteps.map((step) => {
    switch (step.id) {
      case 'details':
        return updateStep(
          step,
          onboardingValidation,
          profileTab ? profileTab({}).editContactInfo({}).$ : undefined,
        );

      case 'role':
        return updateStep(
          step,
          onboardingValidation,
          user
            ? network({})
                .users({})
                .user({ userId: user.id })
                .research({})
                .editTeamMembership({ teamId: user.teams[0]?.id }).$
            : undefined,
        );

      case 'skills':
        return updateStep(
          step,
          onboardingValidation,
          user
            ? network({})
                .users({})
                .user({ userId: user.id })
                .research({})
                .editSkills({}).$
            : undefined,
        );
      case 'questions':
        return updateStep(
          step,
          onboardingValidation,
          user
            ? network({})
                .users({})
                .user({ userId: user.id })
                .research({})
                .editQuestions({}).$
            : undefined,
        );

      case 'bio':
        return updateStep(
          step,
          onboardingValidation,
          user
            ? network({})
                .users({})
                .user({ userId: user.id })
                .about({})
                .editBiography({}).$
            : undefined,
        );

      default:
        return step;
    }
  });

  return {
    steps: steps.filter((step) => step.modalHref),
    isOnboardable: onboardingValidation.isOnboardable,
  };
};
