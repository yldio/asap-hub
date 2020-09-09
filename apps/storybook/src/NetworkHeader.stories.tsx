import React from 'react';
import { NetworkPageHeader } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './decorators';

export default {
  title: 'Templates / Network / Header',
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <NetworkPageHeader />;
