import { gp2 } from '@asap-hub/model';
import { Entity, Rest, RestPayload } from '../common';

export interface User<TAvatar = string> {
  avatar: TAvatar[];
  connections: { code: string }[];
  degree?: gp2.UserDegree[];
  email: string;
  firstName: string;
  lastName: string;
  region?: gp2.UserRegion;
  role: gp2.UserRole;
}

export interface RestUser extends Entity, Rest<User> {}

export interface InputUser extends Entity, RestPayload<User<string>> {}
