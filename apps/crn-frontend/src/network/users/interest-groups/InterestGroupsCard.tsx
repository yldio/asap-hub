import { UserInterestGroupCard } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';

import { useUserInterestGroupsById } from './state';

const InterestGroupsCard: React.FC<{ user: UserResponse }> = ({ user }) => {
  const interestGroups = useUserInterestGroupsById(user.id);

  if (interestGroups === 'noSuchUser') {
    throw new Error(
      `Failed to fetch groups for user with id ${user.id}. User does not exist.`,
    );
  }

  return interestGroups.total ? (
    <UserInterestGroupCard {...user} interestGroups={interestGroups.items} />
  ) : null;
};

export default InterestGroupsCard;
