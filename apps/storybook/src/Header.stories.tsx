import React from 'react';

import { Header } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './layout';

export default {
  title: 'Molecules / Header',
  component: Header,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <Header />;
export const Transparent = () => (
  <div style={{ backgroundColor: '#00222c' }}>
    <Header transparent />
  </div>
);
