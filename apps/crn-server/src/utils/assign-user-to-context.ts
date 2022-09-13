import { UserResponse } from '@asap-hub/model';
import { Request } from 'express';

const assignUserToContext = (req: Request, user: UserResponse): void => {
  req.loggedInUser = user;
};

export default assignUserToContext;
