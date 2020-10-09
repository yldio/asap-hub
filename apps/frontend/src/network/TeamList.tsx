import React from 'react';
import { Paragraph, NetworkTeams } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';
import { join } from 'path';

import { useTeams } from '../api';

interface NetworkTeamListProps {
  searchQuery?: string;
  filters: Set<string>;
}

const NetworkTeamList: React.FC<NetworkTeamListProps> = ({
  searchQuery,
  filters,
}) => {
  const { loading, data: teamsData, error } = useTeams({
    searchQuery,
    filters: [...filters],
  });

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (error) {
    return (
      <Paragraph>
        {error.name}
        {': '}
        {error.message}
      </Paragraph>
    );
  }
  if (teamsData) {
    const teams = teamsData.items.map((team: TeamResponse) => ({
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
  }

  return <Paragraph>No results</Paragraph>;
};

export default NetworkTeamList;
