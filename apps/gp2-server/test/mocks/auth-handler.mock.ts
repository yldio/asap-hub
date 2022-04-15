import { AuthHandler } from '../../src/middleware/auth-handler';
import { userMock } from './validate-token.mock';

export const authHandlerMock: AuthHandler = (req, _res, next) => {
  req.loggedInUser = userMock;
  return next();
};
