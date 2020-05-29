import React from 'react';
import { boolean } from '@storybook/addon-knobs';

import { GoogleSigninButton } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Auth / Google Signin Button',
  component: GoogleSigninButton,
};

export const Normal = () => (
  <GoogleSigninButton enabled={boolean('Enabled', true)} />
);
