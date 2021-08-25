import { UserResponse } from '@asap-hub/model';

export const USER_SOCIAL_WEBSITE = /^http(s?):\/\/\S+/i;
export const USER_SOCIAL_RESEARCHER_ID = /^[a-z]{1,3}-\d{4}-20\d\d$/i;
export const USER_SOCIAL_NOT_URL = /^(?!\s*http(s?):\/\/)\S+/i;

const getFailedResponse = () => ({
  isOnboardable: false,
});

type UserValidationResponse = {
  isOnboardable: boolean;
};

export const isUserOnboardable = (
  user: UserResponse,
): UserValidationResponse => {
  if (user.questions.length < 2) {
    return getFailedResponse();
  }

  if (user.teams.length === 0) {
    return getFailedResponse();
  }

  if (user.teams.map((team) => team.approach).filter(Boolean).length === 0) {
    return getFailedResponse();
  }

  if (
    user.teams.map((team) => team.responsibilities).filter(Boolean).length === 0
  ) {
    return getFailedResponse();
  }

  if (typeof user.institution === 'undefined') {
    return getFailedResponse();
  }

  if (typeof user.jobTitle === 'undefined') {
    return getFailedResponse();
  }

  if (typeof user.city === 'undefined') {
    return getFailedResponse();
  }

  if (typeof user.country === 'undefined') {
    return getFailedResponse();
  }

  if (typeof user.biography === 'undefined') {
    return getFailedResponse();
  }

  if (user.skills.length < 5) {
    return getFailedResponse();
  }

  return {
    isOnboardable: true,
  };
};
