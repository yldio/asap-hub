import React from 'react';

import {
  Paragraph,
  Link,
  LoginLogoutButton,
  Layout,
} from '@asap-hub/react-components';

const Home: React.FC<{}> = () => {
  return (
    <Layout navigation>
      <Paragraph primary>Welcome to the ASAP Hub!</Paragraph>
      <Paragraph>
        By{' '}
        <Link href="https://parkinsonsroadmap.org/">
          ASAP: Aligning Science Across Parkinson's
        </Link>
      </Paragraph>
      <LoginLogoutButton />
    </Layout>
  );
};

export default Home;
