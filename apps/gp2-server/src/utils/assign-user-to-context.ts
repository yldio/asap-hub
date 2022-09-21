import { gp2 } from '@asap-hub/model';
import { Request } from 'express';

const assignUserToContext = (req: Request, user: gp2.UserResponse): void => {
  req.loggedInUser = user;
};

export default assignUserToContext;
