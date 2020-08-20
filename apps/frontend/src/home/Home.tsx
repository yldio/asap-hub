import React from 'react';

import { LoginLogoutButton, Display } from '@asap-hub/react-components';

const Home: React.FC<{}> = () => {
  return (
    <>
      <Display>Dashboard</Display>
      <LoginLogoutButton />
    </>
  );
};

export default Home;
