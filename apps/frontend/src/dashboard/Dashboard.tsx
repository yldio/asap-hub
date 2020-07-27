import React from 'react';

import {
  LoginLogoutButton,
  Layout,
  Container,
  Display,
} from '@asap-hub/react-components';

import { withUser } from '../auth';

const Home: React.FC<{}> = () => {
  return (
    <Layout navigation>
      <Container>
        <Display>Welcome to the Hub</Display>
        <LoginLogoutButton />
      </Container>
    </Layout>
  );
};

export default withUser(Home);
