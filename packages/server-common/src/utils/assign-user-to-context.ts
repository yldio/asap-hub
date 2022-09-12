import { Request } from 'express';

export interface RequestWithUser<T> extends Request {
  loggedInUser: T;
}

const assignUserToContext = <T>(req: RequestWithUser<T>, user: T): void => {
  req.loggedInUser = user;
};

export type AssignUserToContext = typeof assignUserToContext;

export { assignUserToContext };
