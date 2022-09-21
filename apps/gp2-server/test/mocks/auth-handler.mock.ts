import { AuthHandler } from '@asap-hub/server-common';
import { getUserResponse } from '../fixtures/user.fixtures';

export const authHandlerMock: AuthHandler = (req, _res, next) => {
  const user = getUserResponse();
  req.loggedInUser = user;
  return next();
};
