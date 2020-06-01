import React from 'react';

import {
  Theme,
  Paragraph,
  Link,
  LoginLogoutButton,
} from '@asap-hub/react-components';

import './Home.css';

const Home = () => {
  return (
    <div className="App">
      <Theme variant="dark">
        <header className="App-header">
          <Paragraph>
            <img
              src="https://parkinsonsroadmap.org/wp-content/uploads/2019/08/cropped-ASAP_Logo_FullColor.png"
              className="App-logo"
              alt="logo"
            />
          </Paragraph>
          <Paragraph primary>Welcome to the ASAP Hub!</Paragraph>
          <Paragraph>
            By{' '}
            <Link href="https://parkinsonsroadmap.org/">
              ASAP: Aligning Science Across Parkinson's
            </Link>
          </Paragraph>
          <LoginLogoutButton />
        </header>
      </Theme>
    </div>
  );
};

export default Home;
