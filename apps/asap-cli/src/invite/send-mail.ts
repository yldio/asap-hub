import aws from 'aws-sdk';

export interface Welcome {
  displayName: string;
  link: string;
}

const ses = new aws.SES({ apiVersion: '2010-12-01', region: 'us-east-1'});
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
    Source: 'no-reply@hub.asap.science',
  };

  return ses.sendTemplatedEmail(params).promise();
};
