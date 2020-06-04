import aws from 'aws-sdk';
import { sesEndpoint } from '../config';

export interface Welcome {
  displayName: string;
  link: string;
}

const templates = {
  welcome: {
    html: ({ displayName, link }: Welcome): string =>
      `<div><p>Hey, ${displayName}</p><a href="${link}">${link}</a></div>`,
    text: ({ displayName, link }: Welcome): string =>
      `Hey, ${displayName}\n\n${link}`,
  },
};

const ses = new aws.SES({ apiVersion: '2010-12-01', endpoint: sesEndpoint });
export const sendEmail = async ({
  to,
  template,
  values,
}: {
  to: [string];
  template: 'welcome';
  values: object;
}): Promise<unknown> => {
  const content = templates[template] as {
    html: Function;
    text: Function;
  };

  const params = {
    Destination: {
      ToAddresses: to,
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: content.html(values),
        },
        Text: {
          Charset: 'UTF-8',
          Data: content.text(values),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Welcome',
      },
    },
    Source: 'no-reply@asap.yld.io',
  };
  return ses.sendEmail(params).promise();
};
