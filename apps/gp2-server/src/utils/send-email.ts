import { welcome } from '@asap-hub/message-templates';
import { AWSError } from 'aws-sdk';
import SES, { SendTemplatedEmailResponse } from 'aws-sdk/clients/ses';
import { PromiseResult } from 'aws-sdk/lib/request';
import { userInviteBcc, userInviteReturn, userInviteSender } from '../config';

export interface Welcome {
  displayName: string;
  link: string;
}

export const sendEmailFactory =
  (
    ses: SES,
  ): ((params: {
    to: string[];
    template: 'Welcome';
    values: typeof welcome;
  }) => Promise<PromiseResult<SendTemplatedEmailResponse, AWSError>>) =>
  async ({ to, template, values }) => {
    const params: SES.SendTemplatedEmailRequest = {
      Destination: {
        ToAddresses: to,
        BccAddresses: [userInviteBcc],
      },
      Template: template,
      TemplateData: JSON.stringify(values),
      Source: userInviteSender,
      ReturnPath: userInviteReturn,
    };

    return ses.sendTemplatedEmail(params).promise();
  };

export type SendEmail = ReturnType<typeof sendEmailFactory>;
