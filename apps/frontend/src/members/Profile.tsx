import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Header,
  Container,
  Profile,
  Layout,
  Paragraph,
} from '@asap-hub/react-components';
import { useUserById } from '../api';

const Page: React.FC<{}> = () => {
  const { id } = useParams();

  const { loading, data: profile, error } = useUserById(id);

  if (loading) {
    return (
      <Layout>
        <Paragraph>Loading...</Paragraph>
      </Layout>
    );
  }

  if (profile) {
    const initials = `${(profile.firstName && profile.firstName[0]) || ''}${
      (profile.lastName && profile.lastName[0]) || ''
    }`;

    return (
      <>
        <Header />
        <Container>
          <Profile
            department={'Unknown Department'}
            displayName={profile.displayName}
            initials={initials}
            institution={profile.institution || 'Unknown Institution'}
            lastModified={new Date()}
            team={'Team Unknown'}
            title={'Unknown Title'}
            role={'Unknown Role'}
          />
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
