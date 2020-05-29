import React from 'react';

import { LoginLogoutButton } from '@asap-hub/react-components';

import './Home.css';

const Home = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <img
            src="https://parkinsonsroadmap.org/wp-content/uploads/2019/08/cropped-ASAP_Logo_FullColor.png"
            className="App-logo"
            alt="logo"
          />
        </p>
        <p>
          <big>Welcome to the ASAP Hub!</big>
        </p>
        <p>
          <big>
            By{' '}
            <a
              className="App-link"
              href="https://parkinsonsroadmap.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ASAP: Aligning Science Across Parkinson's
            </a>
          </big>
        </p>
        <LoginLogoutButton />
      </header>
    </div>
  );
};

export default Home;
