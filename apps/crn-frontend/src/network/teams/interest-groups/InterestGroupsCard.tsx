import { TeamInterestGroupsTabbedCard } from '@asap-hub/react-components';

import { useTeamInterestGroupsById } from './state';

const InterestGroupsCard: React.FC<{ id: string; isInactive?: string }> = ({
  id,
  isInactive,
}) => {
  const interestGroups = useTeamInterestGroupsById(id);

  if (interestGroups === 'noSuchTeam') {
    throw new Error(
      `Failed to fetch groups for team with id ${id}. Team does not exist.`,
    );
  }

  return (
    <TeamInterestGroupsTabbedCard
      title={'Team Interest Groups'}
      interestGroups={interestGroups.items}
      isTeamInactive={!!isInactive}
    />
  );
};

export default InterestGroupsCard;
