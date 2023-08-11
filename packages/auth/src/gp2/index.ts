import { gp2 } from '@asap-hub/model';

export type User = Pick<
  gp2.UserResponse,
  | 'id'
  | 'onboarded'
  | 'displayName'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'avatarUrl'
  | 'role'
>;
