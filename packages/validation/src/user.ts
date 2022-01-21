import { UserResponse } from '@asap-hub/model';

export const USER_SOCIAL_WEBSITE = /^http(s?):\/\/\S+/i;
export const USER_SOCIAL_RESEARCHER_ID = /^[a-z]{1,3}-\d{4}-20\d\d$/i;
export const USER_SOCIAL_NOT_URL = /^(?!\s*http(s?):\/\/)\S+/i;
export const VALID_ORCID = /^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/;

export type UserValidationFields = Partial<
  Pick<
    // eslint-disable-next-line no-unused-vars
    { [P in keyof UserResponse]: { valid: boolean } },
    | 'questions'
    | 'teams'
    | 'institution'
    | 'jobTitle'
    | 'city'
    | 'country'
    | 'biography'
    | 'expertiseAndResourceTags'
    | 'responsibilities'
    | 'researchInterests'
  >
>;

export type UserValidationResponse = {
  isOnboardable: boolean;
} & UserValidationFields;

export const isUserOnboardable = (
  user: UserResponse,
): UserValidationResponse => {
  const response: Omit<UserValidationResponse, 'isOnboardable'> = {};

  if (user.role !== 'Staff') {
    if (user.questions.length < 2) {
      response.questions = { valid: false };
    }

    if (user.teams.length === 0) {
      response.teams = { valid: false };
    }
    if (!user.researchInterests) {
      response.researchInterests = { valid: false };
    }
  }

  if (!user.institution) {
    response.institution = { valid: false };
  }

  if (!user.jobTitle) {
    response.jobTitle = { valid: false };
  }

  if (!user.city) {
    response.city = { valid: false };
  }

  if (!user.country) {
    response.country = { valid: false };
  }

  if (!user.biography) {
    response.biography = { valid: false };
  }

  if (user.expertiseAndResourceTags.length < 5) {
    response.expertiseAndResourceTags = { valid: false };
  }

  if (!user.responsibilities) {
    response.responsibilities = { valid: false };
  }

  if (Object.keys(response).length === 0) {
    return {
      isOnboardable: true,
    };
  }
  return { ...response, isOnboardable: false };
};
