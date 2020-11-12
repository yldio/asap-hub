import aws from 'aws-sdk';
import { grantsFromEmail } from '../config';

export interface Welcome {
  displayName: string;
  link: string;
}

const ses = new aws.SES({ apiVersion: '2010-12-01', region: 'us-east-1' });
export const sendEmail = async ({
  to,
  template,
  values,
}: {
  to: string[];
  template: 'Welcome';
  values: unknown;
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
