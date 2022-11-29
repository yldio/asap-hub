import { gp2 } from '@asap-hub/model';
import { isUserOnboardable } from '../../src/gp2/user';
import { getUserResponse } from '../fixtures/gp2/user.fixtures';

describe('isUserOnboardable validation', () => {
  it('Should pass if the user profile is complete', async () => {
    expect(isUserOnboardable(getUserResponse())).toEqual({
      isOnboardable: true,
    });
  });

  it.each(['firstName', 'lastName', 'region', 'country', 'positions'])(
    'Should fail if %s is missing from user profile',
    async (fieldName) => {
      const userResponse: gp2.UserResponse = getUserResponse();
      userResponse[fieldName] = null;

      expect(isUserOnboardable(userResponse)).toEqual({
        isOnboardable: false,
        [fieldName]: { valid: false },
      });
    },
  );

  it('Should fail if there are no positions', async () => {
    const userIncompleteResponse: gp2.UserResponse = {
      ...getUserResponse(),
      positions: [],
    };

    expect(isUserOnboardable(userIncompleteResponse)).toEqual({
      isOnboardable: false,
      positions: { valid: false },
    });
  });
});
