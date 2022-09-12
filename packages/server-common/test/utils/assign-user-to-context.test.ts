import {
  assignUserToContext,
  RequestWithUser,
} from '../../src/utils/assign-user-to-context';

describe('Assign User To Context', () => {
  test('should assign the user to context', () => {
    const user = 'a-user';
    const req = {} as RequestWithUser<typeof user>;
    assignUserToContext(req, user);
    expect(req.loggedInUser).toEqual(user);
  });
});
