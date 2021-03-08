import React from 'react';
import { join } from 'path';
import { TeamGroupsCard } from '@asap-hub/react-components';

import { NETWORK_PATH } from '@asap-hub/frontend/src/routes';
import { GROUPS_PATH } from '../../routes';
import { useTeamGroupsById } from './state';

const GroupsCard: React.FC<{ id: string }> = ({ id }) => {
  const { items, total } = useTeamGroupsById(id);
  return total > 0 ? (
    <TeamGroupsCard
      groups={items.map((group) => ({
        ...group,
        href: join('/', NETWORK_PATH, GROUPS_PATH, group.id),
      }))}
    />
  ) : null;
};

export default GroupsCard;
