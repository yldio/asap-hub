import { UserInterestGroupCard } from '@asap-hub/react-components';
import { ListGroupResponse, UserResponse } from '@asap-hub/model';

const GroupsCard: React.FC<{
  user: UserResponse;
  groups?: ListGroupResponse | 'noSuchUser';
}> = ({ user, groups }) => {
  if (groups === 'noSuchUser') {
    throw new Error(
      `Failed to fetch groups for user with id ${user.id}. User does not exist.`,
    );
  }

  return groups ? (
    <UserInterestGroupCard {...user} groups={groups.items} />
  ) : null;
};

export default GroupsCard;
