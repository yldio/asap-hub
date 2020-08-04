import React from 'react';
import { WelcomePage } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { MemoryRouter } from 'react-router-dom';

import { NoPaddingDecorator } from './padding';

export default {
  title: 'Pages / Auth / Welcome',
  component: WelcomePage,
  decorators: [
    NoPaddingDecorator,
    (story: () => {}) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
  ],
};

export const Normal = () => <WelcomePage onClick={action('sign-in-click')} />;
export const Signup = () => (
  <WelcomePage signup onClick={action('create-account-click')} />
);
