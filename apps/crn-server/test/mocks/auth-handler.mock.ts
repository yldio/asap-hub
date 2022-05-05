import { userMock } from '@asap-hub/fixtures';
import { AuthHandler } from '@asap-hub/server-common';

export const authHandlerMock: AuthHandler = (req, _res, next) => {
  req.loggedInUser = userMock;
  return next();
};
