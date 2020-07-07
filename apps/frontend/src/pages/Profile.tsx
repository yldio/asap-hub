import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header, Container } from '@asap-hub/react-components';
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
    return (
      <>
        <Header />
        <Container>
          <pre>{JSON.stringify(data, null, 2)}</pre>
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
