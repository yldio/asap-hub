import { Request } from 'express';
import assignUserToContext from '../../src/utils/assign-user-to-context';
import { getUserResponse } from '../fixtures/user.fixtures';

describe('Assign User To Context', () => {
  test('should assign the user to context', () => {
    const user = getUserResponse();
    const req = {} as Request;
    assignUserToContext(req, user);
    expect(req.loggedInUser).toEqual(user);
  });
});
