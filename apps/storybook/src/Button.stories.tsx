import React from 'react';
import { boolean, text } from '@storybook/addon-knobs';

import { Button } from '@asap-hub/react-components';

export default { title: 'Atoms / Button' };

export const Plain = () => (
  <Button
    enabled={boolean('Enabled', true)}
    primary={boolean('Primary', true)}
    small={boolean('Small', false)}
  >
    {text('Text', 'Text')}
  </Button>
);
