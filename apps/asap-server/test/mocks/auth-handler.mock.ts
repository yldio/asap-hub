import { AuthHandler } from '../../src/middleware/authentication';

export const authHandlerMock: AuthHandler = (_req, _res, next) => next();
