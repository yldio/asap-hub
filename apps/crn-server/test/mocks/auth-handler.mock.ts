import { createUserResponse } from '@asap-hub/fixtures';
import { AuthHandler } from '@asap-hub/server-common';

export const authHandlerMock: AuthHandler = (req, _res, next) => {
  const mockUser = createUserResponse();
  req.loggedInUser = mockUser;
  return next();
};
