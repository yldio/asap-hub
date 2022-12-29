import { gp2 } from '@asap-hub/model';

export type UserValidationFields = Partial<
  Pick<
    { [P in keyof gp2.UserResponse]: { valid: boolean } },
    | 'firstName'
    | 'lastName'
    | 'degrees'
    | 'region'
    | 'country'
    | 'positions'
    | 'keywords'
    | 'biography'
  >
>;

export type UserValidationResponse = {
  isOnboardable: boolean;
} & UserValidationFields;

const invalidPosition = ({ institution, department, role }: gp2.UserPosition) =>
  !(institution && department && role);

export const isUserOnboardable = (
  user: gp2.UserResponse,
): UserValidationResponse => {
  const response: Omit<UserValidationResponse, 'isOnboardable'> = {};

  if (!user.firstName) {
    response.firstName = { valid: false };
  }
  if (!user.lastName) {
    response.lastName = { valid: false };
  }
  if (!user.degrees || user.degrees.length === 0) {
    response.degrees = { valid: false };
  }
  if (!user.region) {
    response.region = { valid: false };
  }
  if (!user.country) {
    response.country = { valid: false };
  }
  if (
    !user.positions ||
    user.positions.length === 0 ||
    user.positions.some(invalidPosition)
  ) {
    response.positions = { valid: false };
  }
  if (!user.keywords || user.keywords.length === 0) {
    response.keywords = { valid: false };
  }
  if (!user.biography) {
    response.biography = { valid: false };
  }

  if (Object.keys(response).length === 0) {
    return {
      isOnboardable: true,
    };
  }
  return { ...response, isOnboardable: false };
};
