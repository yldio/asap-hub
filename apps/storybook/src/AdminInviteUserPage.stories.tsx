import React from 'react';
import { text } from '@storybook/addon-knobs';

import { AdminInviteUserPage } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './padding';

export default {
  title: 'Pages / Admin / Invite User',
  decorators: [NoPaddingDecorator],
};

export const Initial = () => <AdminInviteUserPage state="initial" />;
export const Loading = () => <AdminInviteUserPage state="loading" />;
export const Success = () => <AdminInviteUserPage state="success" />;
export const ErrorState = () => (
  <AdminInviteUserPage
    state={new Error(text('Error Message', 'Unauthorized'))}
  />
);
ErrorState.storyName = 'Error';
