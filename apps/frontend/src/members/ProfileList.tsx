import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  Layout,
  Paragraph,
} from '@asap-hub/react-components';
import { useUsers } from '../api';

type ProfileProps = {
  readonly id: string;
  readonly displayName: string;
};

const Profile: React.FC<ProfileProps> = ({ id, displayName }) => {
  return (
    <>
      <Link to={`/members/${id}`}>{displayName}</Link>
      {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </>
  );
};

const Page: React.FC<{}> = () => {
  const { loading, data: users, error } = useUsers();

  if (loading) {
    return (
      <Layout>
        <Paragraph>Loading...</Paragraph>
      </Layout>
    );
  }

  if (users) {
    return (
      <>
        <Header />
        <Container>
          {users.map((profile: ProfileProps) => {
            return <Profile key={profile.id} {...profile} />;
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
