import { AuthHandler } from '../../src/middleware/auth-handler';

export const authHandlerMock: AuthHandler = (_req, _res, next) => next();
