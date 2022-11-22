import { gp2 } from '@asap-hub/model';

export type UserValidationFields = Partial<
  Pick<
    { [P in keyof gp2.UserResponse]: { valid: boolean } },
    'firstName' | 'lastName' | 'region' | 'country' | 'positions'
  >
>;

export type UserValidationResponse = {
  isOnboardable: boolean;
} & UserValidationFields;

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

  if (!user.region) {
    response.region = { valid: false };
  }
  if (!user.country) {
    response.country = { valid: false };
  }

  if (!user.positions || user.positions.length === 0) {
    response.positions = { valid: false };
  }
  if (Object.keys(response).length === 0) {
    return {
      isOnboardable: true,
    };
  }
  return { ...response, isOnboardable: false };
};
