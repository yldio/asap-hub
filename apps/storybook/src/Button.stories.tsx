import React from 'react';
import { boolean, text } from '@storybook/addon-knobs';

import { orcidIcon, Button } from '@asap-hub/react-components';

export default {
  title: 'Atoms / Button',
  component: Button,
};

export const Text = () => (
  <Button
    enabled={boolean('Enabled', true)}
    primary={boolean('Primary', true)}
    small={boolean('Small', false)}
  >
    {text('Text', 'Text')}
  </Button>
);

export const Icon = () => (
  <Button
    enabled={boolean('Enabled', true)}
    primary={boolean('Primary', true)}
    small={boolean('Small', false)}
  >
    {orcidIcon}
  </Button>
);

export const IconAndText = () => (
  <Button
    enabled={boolean('Enabled', true)}
    primary={boolean('Primary', true)}
    small={boolean('Small', false)}
  >
    {orcidIcon}
    {text('Text', 'Text')}
  </Button>
);
