import React from 'react';

import {
  loadingImage,
  validTickGreenImage,
  validTickWhiteImage,
} from '@asap-hub/react-components';

export default { title: 'Atoms / Images' };

export const Loading = () => <img alt="Loading" src={loadingImage} />;
export const ValidTickGreen = () => (
  <img alt="Valid Tick" src={validTickGreenImage} />
);
export const ValidTickWhite = () => (
  <img
    alt="Valid Tick"
    src={validTickWhiteImage}
    style={{ backgroundColor: 'lightgrey' }}
  />
);
