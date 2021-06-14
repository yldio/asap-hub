import { UserResponse } from '@asap-hub/model';

export const USER_SOCIAL_WEBSITE = /^http(s?):\/\/.+/i;
export const USER_SOCIAL_RESEARCHER_ID = /^[a-z]{1,3}-\d{4}-20\d\d$/i;
export const USER_SOCIAL_NOT_URL = /^(?!\s*http(s?):\/\/).+/i;

export const isUserOnboardable = (user: UserResponse) => {
  if (user.questions.length < 2) {
    return {
      isOnboardable: false,
    };
  }

  return {
    isOnboardable: true,
  };
};
