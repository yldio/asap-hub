import { createSendEmailFactory } from '@asap-hub/server-common';
import { userInviteBcc, userInviteReturn, userInviteSender } from '../config';

export const sendEmailFactory = createSendEmailFactory(
  userInviteBcc,
  userInviteReturn,
  userInviteSender,
);
