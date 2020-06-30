import React from 'react';

import { Container } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './padding';

export default {
  title: 'Molecules / Container',
  component: Container,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <Container>
    <div
      style={{
        backgroundColor: '#fafafa',
        display: 'flex',
        flex: '1',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      Content
    </div>
  </Container>
);
