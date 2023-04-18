import { welcome } from '@asap-hub/message-templates';
import AWS_SES, { SES } from '@aws-sdk/client-ses';

export interface Welcome {
  displayName: string;
  link: string;
}

export const crnWelcomeTemplate = 'Crn-Welcome';
export const gp2WelcomeTemplate = 'Gp2-Welcome';
export type SendEmailTemplate =
  | typeof crnWelcomeTemplate
  | typeof gp2WelcomeTemplate;

export type SendEmail = (params: {
  to: string[];
  template: SendEmailTemplate;
  values: typeof welcome;
}) => Promise<AWS_SES.SendTemplatedEmailCommandOutput>;

export const createSendEmailFactory =
  (userInviteBcc: string, userInviteReturn: string, userInviteSender: string) =>
  (ses: SES): SendEmail =>
  async ({ to, template, values }) => {
    const params: AWS_SES.SendTemplatedEmailCommandInput = {
      Destination: {
        ToAddresses: to,
        BccAddresses: [userInviteBcc],
      },
      Template: template,
      TemplateData: JSON.stringify(values),
      Source: userInviteSender,
      ReturnPath: userInviteReturn,
    };

    return ses.sendTemplatedEmail(params);
  };
