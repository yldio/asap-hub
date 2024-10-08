import { MessageLayout, Theme, WelcomeMessage } from '@asap-hub/gp2-components';
import { welcome } from '@asap-hub/message-templates';
import { GP2_APP_ORIGIN as APP_ORIGIN } from '../config';

export default (
  <Theme>
    <MessageLayout appOrigin={APP_ORIGIN}>
      <WelcomeMessage {...welcome} />
    </MessageLayout>
  </Theme>
);

export const subject = `Welcome ${welcome.firstName}!`;
