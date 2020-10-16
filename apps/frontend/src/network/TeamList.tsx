import React from 'react';
import { Paragraph, NetworkTeams } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';
import { join } from 'path';

import { useTeams } from '../api';

interface NetworkTeamListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const NetworkTeamList: React.FC<NetworkTeamListProps> = ({
  searchQuery,
  filters = new Set(),
}) => {
  const result = useTeams({
    searchQuery,
    filters: [...filters],
  });

  if (result.loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  const teams = result.data.items.map((team: TeamResponse) => ({
    ...team,
    href: join('/network/teams', team.id),
  }));
  return (
    <NetworkTeams
      teams={teams}
      numberOfItems={teams.length}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
    />
  );
};

export default NetworkTeamList;
