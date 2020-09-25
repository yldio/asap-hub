import React from 'react';

import { PasswordResetEmailSentPage } from '@asap-hub/react-components';
import { BasicLayoutDecorator } from './decorators';

export default {
  title: 'Pages / Auth / Forgot Password / Email Sent',
  component: PasswordResetEmailSentPage,
  decorators: [BasicLayoutDecorator],
};

export const Normal = () => <PasswordResetEmailSentPage signInHref="#" />;
