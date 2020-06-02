import aws from 'aws-sdk';

const templates = {
  welcome: {
    html: ({ code }: { code: string }): string => `<p>${code}</p>`,
    text: ({ code }: { code: string }): string => code,
  },
};

const ses = new aws.SES({ apiVersion: '2010-12-01' });
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
