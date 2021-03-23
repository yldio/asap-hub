import React from 'react';
import { MessageLayout, WelcomeMessage } from '@asap-hub/react-components';
import { welcome } from '@asap-hub/message-templates';

export default (
  <MessageLayout
    privacyPolicyHref={'https://hub.asap.science/privacy-policy'}
    termsHref={'https://hub.asap.science/terms-and-conditions'}
  >
    <WelcomeMessage {...welcome} />
  </MessageLayout>
);

export const subject = `Welcome ${welcome.firstName}!`;
