import { InterestGroupLeader, UserDataObject } from '@asap-hub/model';
import { parseUserDisplayName } from '@asap-hub/server-common';

export const parseInterestGroupLeader = (
  user: UserDataObject,
): InterestGroupLeader['user'] => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  displayName: parseUserDisplayName(
    user.firstName,
    user.lastName,
    undefined,
    user.nickname,
  ),
  email: user.email,
  teams: user.teams,
  avatarUrl: user.avatarUrl,
  alumniSinceDate: user.alumniSinceDate,
});
