import { AuthHandler } from '../../src/middleware/auth-handler';
import { userMock } from '../../src/utils/__mocks__/validate-token';

export const authHandlerMock: AuthHandler = (req, _res, next) => {
  req.loggedUser = userMock;
  return next();
};
