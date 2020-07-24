import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  Layout,
  Paragraph,
} from '@asap-hub/react-components';
import { useTeams } from '../api';

const Page: React.FC = () => {
  const { loading, data: teams, error } = useTeams();

  if (loading) {
    return (
      <Layout>
        <Paragraph>Loading...</Paragraph>
      </Layout>
    );
  }

  if (teams) {
    return (
      <>
        <Header />
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
