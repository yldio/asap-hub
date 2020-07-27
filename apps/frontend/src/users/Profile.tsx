import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Profile, Paragraph } from '@asap-hub/react-components';
import { useUserById } from '../api';

const Page: React.FC<{}> = () => {
  const { id } = useParams();

  const { loading, data: profile, error } = useUserById(id);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (profile) {
    const initials = `${(profile.firstName && profile.firstName[0]) || ''}${
      (profile.lastName && profile.lastName[0]) || ''
    }`;

    return (
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
