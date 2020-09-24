import React from 'react';

import { Card } from '@asap-hub/react-components';
import { select } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Card',
  component: Card,
};

export const Normal = () => (
  <Card accent={select('Accent', ['default', 'red', 'green'], 'default')}>
    Content
  </Card>
);

export const NoPadding = () => (
  <Card
    padding={false}
    accent={select('Accent', ['default', 'red', 'green'], 'default')}
  >
    Content
  </Card>
);
