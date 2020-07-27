import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paragraph } from '@asap-hub/react-components';
import { useTeamById } from '../api';

const Page: React.FC<{}> = () => {
  const { id } = useParams();

  const { loading, data: team, error } = useTeamById(id);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (team) {
    return (
      <Container>
        <pre>{JSON.stringify(team, null, 2)}</pre>
      </Container>
    );
  }

  return (
    <Paragraph>
      {error.name}
      {': '}
      {error.message}
    </Paragraph>
  );
};

export default Page;
