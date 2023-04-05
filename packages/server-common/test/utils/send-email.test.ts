import { SES } from '@aws-sdk/client-ses';
import {
  createSendEmailFactory,
  crnWelcomeTemplate,
} from '../../src/utils/send-email';

describe('createSendEmailFactory', () => {
  const sesMock = {
    sendTemplatedEmail: jest.fn(),
  } as unknown as jest.Mocked<SES>;

  test('Should send an email to selected recipients from a predefined sender', async () => {
    const recipients = ['test@test1.com', 'test@test2.com'];
    const params = {
      firstName: 'John',
      link: 'http://test.com',
    };

    const sendEmail = createSendEmailFactory(
      'userInviteBcc',
      'userInviteReturn',
      'userInviteSender',
    )(sesMock);

    await sendEmail({
      to: recipients,
      template: crnWelcomeTemplate,
      values: params,
    });

    expect(sesMock.sendTemplatedEmail).toHaveBeenCalledWith({
      Destination: {
        ToAddresses: recipients,
        BccAddresses: ['userInviteBcc'],
      },
      Template: crnWelcomeTemplate,
      TemplateData: JSON.stringify(params),
      Source: 'userInviteSender',
      ReturnPath: 'userInviteReturn',
    });
  });
});
