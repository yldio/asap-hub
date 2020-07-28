import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Paragraph } from '@asap-hub/react-components';
import { useTeams } from '../api';

type Props = {
  readonly loading: boolean;
  readonly error: Error;
  readonly children: React.ReactNode;
};

const Capture: React.FC<Props> = ({ loading, error, children }) => {
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

  return <>{children}</>;
};

const Page: React.FC = () => {
  const { loading, data: teams, error } = useTeams();

  if (teams && teams.length > 0) {
    return (
      <Capture loading={loading} error={error}>
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
      </Capture>
    );
  }

  return (
    <Capture loading={loading} error={error}>
      <Container>
        <Paragraph>No results</Paragraph>
      </Container>
    </Capture>
  );
};

export default Page;
