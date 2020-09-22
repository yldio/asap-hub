import React from 'react';

import { Card } from '@asap-hub/react-components';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Card',
  component: Card,
};

export const Normal = () => (
  <Card minPadding={boolean('Minimal Padding', false)}>Content</Card>
);
