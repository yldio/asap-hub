import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header, Container, Profile } from '@asap-hub/react-components';
import api from '../api';

const Page: React.FC<{}> = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  useEffect(() => {
    api.users.fetchById(id).then(async (resp) => {
      if (resp.ok) {
        const json = await resp.json();
        setData(json);
      }
    });
  }, [id]);

  if (data) {
    const profile = (data as unknown) as {
      firstName: string;
      lastName: string;
      department: string;
      displayName: string;
      institution: string;
    };

    const initials = `${(profile.firstName && profile.firstName[0]) || ''}${
      (profile.lastName && profile.lastName[0]) || ''
    }`;
    return (
      <>
        <Header />
        <Container>
          <Profile
            department={'Unkown Department'}
            displayName={profile.displayName}
            initials={initials}
            institution={profile.institution}
            lastModified={new Date()}
            team={'Team Unknown'}
            title={'Unknown Title'}
            role={'Unkown Role'}
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <p>Loading</p>
      </Container>
    </>
  );
};

export default Page;
