import { userMock } from '@asap-hub/auth';
import { AuthHandler } from '../../src/middleware/auth-handler';

export const authHandlerMock: AuthHandler = (req, _res, next) => {
  req.loggedInUser = userMock;
  return next();
};
