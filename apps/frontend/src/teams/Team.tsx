import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Header,
  Container,
  Layout,
  Paragraph,
} from '@asap-hub/react-components';
import { useTeamById } from '../api';

const Page: React.FC<{}> = () => {
  const { id } = useParams();

  const { loading, data: team, error } = useTeamById(id);

  if (loading) {
    return (
      <Layout>
        <Paragraph>Loading...</Paragraph>
      </Layout>
    );
  }

  if (team) {
    return (
      <>
        <Header />
        <Container>
          <pre>{JSON.stringify(team, null, 2)}</pre>
        </Container>
      </>
    );
  }

  return (
    <Layout>
      <Paragraph>
        {error.name}
        {': '}
        {error.message}
      </Paragraph>
    </Layout>
  );
};

export default Page;
