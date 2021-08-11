import aws from 'aws-sdk';
import { SendEmailRequest } from 'aws-sdk/clients/ses';
import { sesRegion } from '../../config';

const ses = new aws.SES({ apiVersion: '2010-12-01', region: 'eu-west-1' });

export const handler = async (event: unknown): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(event));
  // eslint-disable-next-line no-console
  console.log(sesRegion);

  const params: SendEmailRequest = {
    Source: 'piotr.szpak@yld.io',
    Destination: { ToAddresses: ['piotr.lukasz.szpak@gmail.com'] },
    Message: {
      Subject: {
        Data: 'From ASAP',
      },
      Body: {
        Text: {
          Data: 'Hello - this is a test',
        },
      },
    },
  };

  await ses.sendEmail(params).promise();
};
