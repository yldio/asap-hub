/* istanbul ignore file */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { GlobalStyles } from '@asap-hub/react-components';

import App from './App';
import * as serviceWorker from './serviceWorker';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <GlobalStyles />
    <App />
  </StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
