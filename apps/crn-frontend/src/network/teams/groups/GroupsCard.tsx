import { TeamGroupsCard } from '@asap-hub/react-components';

import { useTeamGroupsById } from './state';

const GroupsCard: React.FC<{ id: string }> = ({ id }) => {
  const groups = useTeamGroupsById(id);

  if (groups === 'noSuchTeam') {
    throw new Error(
      `Failed to fetch groups for team with id ${id}. Team does not exist.`,
    );
  }

  return groups.total > 0 ? <TeamGroupsCard groups={groups.items} /> : null;
};

export default GroupsCard;
