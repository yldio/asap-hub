import { InterestGroupLeader, UserDataObject } from '@asap-hub/model';

export const parseInterestGroupLeader = (
  user: UserDataObject,
): InterestGroupLeader['user'] => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  displayName: `${user.firstName} ${user.lastName}`,
  email: user.email,
  teams: user.teams,
  avatarUrl: user.avatarUrl,
  alumniSinceDate: user.alumniSinceDate,
});
