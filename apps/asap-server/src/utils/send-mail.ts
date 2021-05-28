/* istanbul ignore file */
import aws, { SES } from 'aws-sdk';
import { sesEndpoint } from '../config';

const ses = new aws.SES({ apiVersion: '2010-12-01', endpoint: sesEndpoint });
export const sendRawEmail = async ({
  to,
  body,
  subject,
}: {
  to: [string];
  body: string;
  subject: string;
}): Promise<unknown> => {
  const params: SES.SendEmailRequest = {
    Destination: {
      ToAddresses: to,
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: 'no-reply@hub.asap.science',
  };

  return ses.sendEmail(params).promise();
};
