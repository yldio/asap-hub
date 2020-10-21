import React from 'react';
import { messages } from '@asap-hub/react-components';

export default () => (
  <messages.Welcome
    firstName="{{ firstName }}"
    link="{{ link }}"
    privacyPolicyHref={'https://hub.asap.science/privacy-policy'}
    termsHref={'https://hub.asap.science/terms-and-conditions'}
  />
);

export const subject = 'Welcome {{ firstName }}!';
