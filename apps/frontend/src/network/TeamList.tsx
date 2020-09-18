import React from 'react';
import { Paragraph, NetworkTeam } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';
import { join } from 'path';

import { useTeams } from '../api';

const Page: React.FC = () => {
  const { loading, data: teamsData, error } = useTeams();

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
    const teams = teamsData.map((team: TeamResponse) => ({
      ...team,
      href: join('/teams', team.id),
    }));
    return <NetworkTeam teams={teams} />;
  }

  return <Paragraph>No results</Paragraph>;
};

export default Page;
