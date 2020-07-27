import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Paragraph } from '@asap-hub/react-components';
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
      <Container>
        {teams.map((team) => {
          const { id } = team;
          return (
            <div key="id">
              <Link to={`/teams/${id}`}>
                <pre>{JSON.stringify(team, null, 2)}</pre>
              </Link>
            </div>
          );
        })}
      </Container>
    );
  }

  return <Paragraph>No results</Paragraph>;
};

export default Page;
