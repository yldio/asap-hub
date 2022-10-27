import {
  TeamGroupsCard,
  TeamTabbedGroupsCard,
} from '@asap-hub/react-components';

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

  return !isInactive ? (
    groups.total > 0 ? (
      <TeamGroupsCard groups={groups.items} />
    ) : null
  ) : (
    <TeamTabbedGroupsCard
      title={'Team Interest Groups'}
      groups={groups.items}
    />
  );
};

export default GroupsCard;
