/* istanbul ignore file */
import { welcome } from '@asap-hub/message-templates';
import aws, { AWSError } from 'aws-sdk';
import { SendTemplatedEmailResponse } from 'aws-sdk/clients/ses';
import { PromiseResult } from 'aws-sdk/lib/request';
import { sesRegion } from '../config';

export interface Welcome {
  displayName: string;
  link: string;
}

export const sendEmailFactory = (): ((params: {
  to: string[];
  template: 'Welcome' | 'Invite';
  values: typeof welcome;
}) => Promise<PromiseResult<SendTemplatedEmailResponse, AWSError>>) => {
  const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: sesRegion,
  });

  return async ({
    to,
    template,
    values,
  }): Promise<PromiseResult<SendTemplatedEmailResponse, AWSError>> => {
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
};

export type SendEmail = ReturnType<typeof sendEmailFactory>;
