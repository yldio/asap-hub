/* istanbul ignore file */
// ignore this file for coverage since we don't have the requirements yet to test it
import { createSendEmailFactory } from '@asap-hub/server-common';
import { userInviteBcc, userInviteReturn, userInviteSender } from '../config';

export const sendEmailFactory = createSendEmailFactory(
  userInviteBcc,
  userInviteReturn,
  userInviteSender,
);
