import React from 'react';
import { ASAP_LINK } from '@asap-hub/example-lib';

import './App.css';

function App() {
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
        <p>Welcome to the ASAP Hub!</p>
        <p>
          By{' '}
          <a
            className="App-link"
            href={ASAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            ASAP: Aligning Science Across Parkinson's
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
