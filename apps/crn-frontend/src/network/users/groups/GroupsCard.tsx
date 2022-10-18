import { UserInterestGroupCard } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';

import { useUserGroupsById } from './state';

const GroupsCard: React.FC<{ user: UserResponse }> = ({ user }) => {
  const groups = useUserGroupsById(user.id);

  if (groups === 'noSuchUser') {
    throw new Error(
      `Failed to fetch groups for user with id ${user.id}. User does not exist.`,
    );
  }

  return groups.total ? (
    <UserInterestGroupCard {...user} groups={groups.items} />
  ) : null;
};

export default GroupsCard;
