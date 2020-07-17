import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header, Container, Profile } from '@asap-hub/react-components';
import api from '../../api';

const Page: React.FC<{}> = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestController = new AbortController();
    api.users
      .fetchById(id, {
        signal: requestController.signal,
      })
      .then(async (resp) => {
        const { ok, status } = resp;
        if (ok) {
          const json = await resp.json();
          setData(json);
        } else if (status >= 400 && status < 500) {
          const json = await resp.json();
          setError(json);
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message);
      });

    return () => requestController.abort();
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
        <p>{error || 'Loading'}</p>
      </Container>
    </>
  );
};

export default Page;
