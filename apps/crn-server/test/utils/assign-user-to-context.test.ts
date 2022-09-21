import { createUserResponse } from '@asap-hub/fixtures';
import { Request } from 'express';
import assignUserToContext from '../../src/utils/assign-user-to-context';

describe('Assign User To Context', () => {
  test('should assign the user to context', () => {
    const user = createUserResponse();
    const req = {} as Request;
    assignUserToContext(req, user);
    expect(req.loggedInUser).toEqual(user);
  });
});
