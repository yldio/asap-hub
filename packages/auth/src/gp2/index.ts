import { gp2 } from '@asap-hub/model';

export type User = Pick<
  gp2.UserMetadataResponse,
  | 'id'
  | 'onboarded'
  | 'displayName'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'avatarUrl'
  | 'role'
  | 'algoliaApiKey'
>;
