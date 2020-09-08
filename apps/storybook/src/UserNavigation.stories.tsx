import React from 'react';

import { UserNavigation } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './decorators';

export default {
  title: 'Organisms / Navigation / User Nav',
  component: UserNavigation,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <UserNavigation />;
