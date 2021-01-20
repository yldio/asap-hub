import React from 'react';

import {
  asapImage,
  asapPaddedImage,
  asapPaddedWhiteImage,
  backgroundBrainsImage,
  backgroundNeuronsImage,
  iCalIconImage,
  loadingImage,
  validTickGreenImage,
  validTickWhiteImage,
} from '@asap-hub/react-components';

export default { title: 'Atoms / Images' };

export const Asap = () => <img alt="ASAP" src={asapImage} />;
export const AsapPadded = () => <img alt="ASAP" src={asapPaddedImage} />;
export const AsapWhite = () => <img alt="ASAP" src={asapPaddedWhiteImage} />;
export const Loading = () => <img alt="Loading" src={loadingImage} />;
export const BackgroundBrains = () => (
  <img alt="Background Brains" src={backgroundBrainsImage} />
);
export const BackgroundNeurons = () => (
  <img alt="Background Neurons" src={backgroundNeuronsImage} />
);
export const ICalIconImage = () => <img alt="ICal Icon" src={iCalIconImage} />;
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
