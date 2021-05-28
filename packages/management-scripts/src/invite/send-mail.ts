import aws from 'aws-sdk';
import { welcome } from '@asap-hub/message-templates';
import { grantsFromEmail } from '../config';

const ses = new aws.SES({ apiVersion: '2010-12-01', region: 'us-east-1' });
export const sendEmail = async ({
  to,
  template,
  values,
}: {
  to: string[];
  template: 'Welcome';
  values: typeof welcome;
}): Promise<unknown> => {
  const params = {
    Destination: {
      ToAddresses: to,
    },
    Template: template,
    TemplateData: JSON.stringify(values),
    Source: grantsFromEmail,
  };

  return ses.sendTemplatedEmail(params).promise();
};
