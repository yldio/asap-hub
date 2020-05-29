import React from 'react';
import { boolean } from '@storybook/addon-knobs';

import { OrcidSigninButton } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Auth / ORCID Signin Button',
  component: OrcidSigninButton,
};

export const Normal = () => (
  <OrcidSigninButton enabled={boolean('Enabled', true)} />
);
