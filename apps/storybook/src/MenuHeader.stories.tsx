import React from 'react';
import { MenuHeader } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './decorators';

export default {
  title: 'Organisms / Menu Header',
  component: MenuHeader,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <MenuHeader />;
