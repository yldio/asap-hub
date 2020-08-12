import React from 'react';

import { LoginLogoutButton, Layout, Display } from '@asap-hub/react-components';

const Home: React.FC<{}> = () => {
  return (
    <Layout navigation>
      <Display>Dashboard</Display>
      <LoginLogoutButton />
    </Layout>
  );
};

export default Home;
