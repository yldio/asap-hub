import React from 'react';

import {
  LoginLogoutButton,
  Layout,
  Display,
  Container,
} from '@asap-hub/react-components';

const Home: React.FC<{}> = () => {
  return (
    <Layout navigation>
      <Container>
        <Display>Dashboard</Display>
        <LoginLogoutButton />
      </Container>
    </Layout>
  );
};

export default Home;
