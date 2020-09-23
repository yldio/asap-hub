import React from 'react';

import { Card } from '@asap-hub/react-components';
import { boolean, select } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Card',
  component: Card,
};

export const Normal = () => (
  <Card
    minPadding={boolean('Minimal Padding', false)}
    accent={select('Accent', ['default', 'red', 'green'], 'default')}
  >
    Content
  </Card>
);
