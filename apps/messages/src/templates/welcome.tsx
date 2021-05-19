import { MessageLayout, WelcomeMessage } from '@asap-hub/react-components';
import { welcome } from '@asap-hub/message-templates';

import { APP_ORIGIN } from '../config';

export default (
  <MessageLayout appOrigin={APP_ORIGIN}>
    <WelcomeMessage {...welcome} />
  </MessageLayout>
);

export const subject = `Welcome ${welcome.firstName}!`;
