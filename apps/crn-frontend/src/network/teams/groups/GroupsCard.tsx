import { TeamTabbedGroupsCard } from '@asap-hub/react-components';

import { useTeamGroupsById } from './state';

const GroupsCard: React.FC<{ id: string; isInactive?: string }> = ({
  id,
  isInactive,
}) => {
  const groups = useTeamGroupsById(id);

  if (groups === 'noSuchTeam') {
    throw new Error(
      `Failed to fetch groups for team with id ${id}. Team does not exist.`,
    );
  }

  return (
    <TeamTabbedGroupsCard
      title={'Team Interest Groups'}
      groups={groups.items}
      inactive={isInactive}
    />
  );
};

export default GroupsCard;
