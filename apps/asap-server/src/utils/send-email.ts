import { welcome } from '@asap-hub/message-templates';
import { AWSError } from 'aws-sdk';
import SES, { SendTemplatedEmailResponse } from 'aws-sdk/clients/ses';
import { PromiseResult } from 'aws-sdk/lib/request';

export interface Welcome {
  displayName: string;
  link: string;
}

export const sendEmailFactory =
  (
    ses: SES,
  ): ((params: {
    to: string[];
    template: 'Welcome' | 'Invite';
    values: typeof welcome;
  }) => Promise<PromiseResult<SendTemplatedEmailResponse, AWSError>>) =>
  async ({ to, template, values }) => {
    const params = {
      Destination: {
        ToAddresses: to,
      },
      Template: template,
      TemplateData: JSON.stringify(values),
      Source: 'no-reply@hub.asap.science',
    };

    return ses.sendTemplatedEmail(params).promise();
  };

export type SendEmail = ReturnType<typeof sendEmailFactory>;
