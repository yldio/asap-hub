import { SES } from 'aws-sdk';
import { userInviteBcc, userInviteSender } from '../../src/config';
import { sendEmailFactory } from '../../src/utils/send-email';

describe('Send Email helper', () => {
  const sesMock = {
    sendTemplatedEmail: jest.fn().mockReturnValue({ promise: jest.fn() }),
  } as unknown as jest.Mocked<SES>;
  const sendEmail = sendEmailFactory(sesMock);

  test('Should send an email to selected recipients from a predefined sender', async () => {
    const recipients = ['test@test1.com', 'test@test2.com'];
    const params = {
      firstName: 'John',
      link: 'http://test.com',
    };

    await sendEmail({
      to: recipients,
      template: 'Invite',
      values: params,
    });

    expect(sesMock.sendTemplatedEmail).toHaveBeenCalledWith({
      Destination: {
        ToAddresses: recipients,
        BccAddresses: [userInviteBcc],
      },
      Template: 'Invite',
      TemplateData: JSON.stringify(params),
      Source: userInviteSender,
    });
  });
});
