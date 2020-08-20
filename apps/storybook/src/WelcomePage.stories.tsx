import React from 'react';
import { WelcomePage } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';

import { NoPaddingDecorator } from './decorators';

export default {
  title: 'Pages / Auth / Welcome',
  component: WelcomePage,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <WelcomePage onClick={action('sign-in-click')} />;
export const Signup = () => (
  <WelcomePage signup onClick={action('create-account-click')} />
);
