import aws from 'aws-sdk';
import { sesEndpoint } from '../config';

export interface Welcome {
  displayName: string;
  link: string;
}

const ses = new aws.SES({ apiVersion: '2010-12-01', endpoint: sesEndpoint });
export const sendEmail = async ({
  to,
  template,
  values,
}: {
  to: [string];
  template: 'Welcome';
  values: unknown;
}): Promise<unknown> => {
  const params = {
    Destination: {
      ToAddresses: to,
    },
    Template: template,
    TemplateData: JSON.stringify(values),
    Source: 'no-reply@asap.yld.io',
  };

  return ses.sendTemplatedEmail(params).promise();
};
