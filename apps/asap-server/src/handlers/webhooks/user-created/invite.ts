import aws from 'aws-sdk';

const ses = new aws.SES({ apiVersion: '2010-12-01', region: 'eu-west-1' });

export const handler = async (event: unknown): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(event));

  const params = {
    Destination: {
      ToAddresses: ['piotr.szpak@yld.io'],
    },
    Template: 'Welcome',
    TemplateData: JSON.stringify({
      firstName: 'Piotr',
      link: 'http://google.com',
    }),
    Source: 'no-reply@yld.io',
  };

  await ses.sendTemplatedEmail(params).promise();
};
