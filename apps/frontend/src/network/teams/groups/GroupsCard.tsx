import React from 'react';
import { TeamGroupsCard } from '@asap-hub/react-components';

import { useTeamGroupsById } from './state';

const GroupsCard: React.FC<{ id: string }> = ({ id }) => {
  const { items, total } = useTeamGroupsById(id);
  return total > 0 ? <TeamGroupsCard groups={items} /> : null;
};

export default GroupsCard;
