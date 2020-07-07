import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header } from '@asap-hub/react-components';
import api from '../api';

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
  const [data, setData] = useState(null);

  useEffect(() => {
    api.users.fetch().then(async (resp) => {
      if (resp.ok) {
        const json = await resp.json();
        setData(json);
      }
    });
  }, []);

  if (data) {
    return (
      <>
        <Header />
        <Container>
          {((data as unknown) as ProfileProps[]).map(
            (profile: ProfileProps) => {
              return <Profile key={profile.id} {...profile} />;
            },
          )}
        </Container>
      </>
    );
  }

  return (
    <Container>
      <p>Loading</p>
    </Container>
  );
};

export default Page;
