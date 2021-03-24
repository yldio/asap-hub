import React from 'react';
import { MessageLayout, WelcomeMessage } from '@asap-hub/react-components';
import { welcome } from '@asap-hub/message-templates';
import { URL } from 'url';

import { APP_ORIGIN } from '../config';

export default (
  <MessageLayout
    privacyPolicyHref={new URL('/privacy-policy', APP_ORIGIN).href}
    termsHref={new URL('/terms-and-conditions', APP_ORIGIN).href}
  >
    <WelcomeMessage {...welcome} />
  </MessageLayout>
);

export const subject = `Welcome ${welcome.firstName}!`;
