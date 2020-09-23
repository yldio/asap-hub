import React from 'react';
import { text } from '@storybook/addon-knobs';
import { ForgotPasswordPage } from '@asap-hub/react-components';
import { BasicLayoutDecorator } from './decorators';

export default {
  title: 'Pages / Auth / Forgot Password',
  component: ForgotPasswordPage,
  decorators: [BasicLayoutDecorator],
};

export const Normal = () => (
  <ForgotPasswordPage email={text('Email', 'john.doe@example.com')} />
);
