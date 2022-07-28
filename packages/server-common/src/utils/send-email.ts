import { welcome } from '@asap-hub/message-templates';
import { AWSError } from 'aws-sdk';
import SES, { SendTemplatedEmailResponse } from 'aws-sdk/clients/ses';
import { PromiseResult } from 'aws-sdk/lib/request';

export interface Welcome {
  displayName: string;
  link: string;
}

export type SendEmailTemplate = 'Crn-Welcome' | 'Gp2-Welcome';

export type SendEmail = (params: {
  to: string[];
  template: SendEmailTemplate;
  values: typeof welcome;
}) => Promise<PromiseResult<SendTemplatedEmailResponse, AWSError>>;

export const createSendEmailFactory =
  (userInviteBcc: string, userInviteReturn: string, userInviteSender: string) =>
  (ses: SES): SendEmail =>
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
