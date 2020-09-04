import React from 'react';
import {
  Paragraph,
  TeamCard,
  NetworkListPage,
} from '@asap-hub/react-components';
import { useTeams } from '../api';

const Page: React.FC = () => {
  const { loading, data: teams, error } = useTeams();

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

  if (teams) {
    return (
      <NetworkListPage>
        {teams.map((team) => {
          const { id } = team;
          return (
            <div key={id}>
              <TeamCard {...team} />
            </div>
          );
        })}
      </NetworkListPage>
    );
  }

  return <Paragraph>No results</Paragraph>;
};

export default Page;
