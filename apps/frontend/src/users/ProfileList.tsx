import React from 'react';
import { Link } from 'react-router-dom';
import { Paragraph, Layout } from '@asap-hub/react-components';
import { useUsers } from '../api';

type ProfileProps = {
  readonly id: string;
  readonly displayName: string;
};

const Profile: React.FC<ProfileProps> = ({ id, displayName }) => {
  return <Link to={`/users/${id}`}>{displayName}</Link>;
};

const Page: React.FC<{}> = () => {
  const { loading, data: users, error } = useUsers();

  if (loading) {
    return (
      <Layout navigation>
        <Paragraph>Loading...</Paragraph>
      </Layout>
    );
  }

  if (users) {
    return (
      <Layout navigation>
        {users.map((profile: ProfileProps) => {
          return <Profile key={profile.id} {...profile} />;
        })}
      </Layout>
    );
  }

  return (
    <Layout navigation>
      <Paragraph>
        {error.name}
        {': '}
        {error.message}
      </Paragraph>
    </Layout>
  );
};

export default Page;
