import { isUserOnboardable, UserValidationFields } from '@asap-hub/validation';
import { network } from '@asap-hub/routing';

import { useUserByIdLoadable } from '../network/users/state';
import { useCurrentUserProfileTabRoute } from './current-user-profile-tab-route';

type OnboardingFieldsReq = { isOnboardable: boolean } & {
  [P in keyof UserValidationFields]: UserValidationFields[P] & {
    modalHref?: string;
  };
};

export const useOnboarding = (id: string): OnboardingFieldsReq => {
  const userById = useUserByIdLoadable(id);
  const profileTab = useCurrentUserProfileTabRoute();

  const user =
    userById.state === 'hasValue' && userById.contents
      ? userById.contents
      : undefined;

  const editContactInfoRoute = profileTab
    ? profileTab({}).editContactInfo({}).$
    : undefined;

  const onboardableResult: OnboardingFieldsReq = user
    ? isUserOnboardable(user)
    : { isOnboardable: false };

  if (onboardableResult.institution) {
    onboardableResult.institution.modalHref = editContactInfoRoute;
  }

  if (onboardableResult.jobTitle) {
    onboardableResult.jobTitle.modalHref = editContactInfoRoute;
  }

  if (onboardableResult.city) {
    onboardableResult.city.modalHref = editContactInfoRoute;
  }

  if (onboardableResult.country) {
    onboardableResult.country.modalHref = editContactInfoRoute;
  }

  if (onboardableResult.biography) {
    onboardableResult.biography.modalHref = user
      ? network({})
          .users({})
          .user({ userId: user.id })
          .about({})
          .editBiography({}).$
      : undefined;
  }

  if (onboardableResult.skills) {
    onboardableResult.skills.modalHref = user
      ? network({})
          .users({})
          .user({ userId: user.id })
          .research({})
          .editSkills({}).$
      : undefined;
  }

  if (onboardableResult.questions) {
    onboardableResult.questions.modalHref = user
      ? network({})
          .users({})
          .user({ userId: user.id })
          .research({})
          .editQuestions({}).$
      : undefined;
  }

  if (onboardableResult.teams) {
    onboardableResult.teams.modalHref = user
      ? network({})
          .users({})
          .user({ userId: user.id })
          .research({})
          .editTeamMembership({ teamId: user.teams[0]?.id }).$
      : undefined;
  }

  return onboardableResult;
};
