import { inviteUsersFactory } from '@asap-hub/management-scripts';
import { handler } from '../../../src/handlers/jobs/invite-users';
import { sendRawEmail } from '../../../src/utils/send-mail';

jest.mock('@asap-hub/management-scripts', () => ({
  inviteUsersFactory: jest.fn(),
}));

jest.mock('../../../src/utils/send-mail', () => ({
  sendRawEmail: jest.fn(),
}));

describe('Invite users handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should email the results after running the script', async () => {
    const logs = [
      'Invited user user1@example.com',
      'Invited user user2@example.com',
    ];
    (inviteUsersFactory as jest.Mock).mockImplementationOnce(
      (log) => async () => {
        log(logs[0]);
        log(logs[1]);
      },
    );

    await handler();
    const args = (sendRawEmail as jest.Mock).mock.calls[0][0];
    expect(args.body).toBe(logs.join('\n'));
    expect(args.subject).toContain('Invite users output -');
  });

  test('Should not send errors on email body', async () => {
    const logs = [
      'Invited user user1@example.com',
      'Invited user user2@example.com',
    ];
    (inviteUsersFactory as jest.Mock).mockImplementationOnce(
      (log) => async () => {
        log(logs[0]);
        log({
          op: 'Fetch teams',
          message: 'some error',
          statusCode: '403',
          body: 'error body',
        });
        log(logs[1]);
      },
    );

    await handler();
    const args = (sendRawEmail as jest.Mock).mock.calls[0][0];
    expect(args.body).toBe(logs.join('\n'));
    expect(args.subject).toContain('Invite users output -');
  });

  test('Should send mail with users invited even if throws', async () => {
    const logs = [
      'Invited user user1@example.com',
      'Invited user user2@example.com',
    ];
    (inviteUsersFactory as jest.Mock).mockImplementationOnce(
      (log) => async () => {
        log(logs[0]);
        log({
          op: 'Fetch teams',
          message: 'some error',
          statusCode: '403',
          body: 'error body',
        });
        throw new Error();
      },
    );

    await handler();
    const args = (sendRawEmail as jest.Mock).mock.calls[0][0];
    expect(args.body).toBe(logs[0]);
    expect(args.subject).toContain('Invite users output -');
  });

  test('Should not send mail if no logs where produced', async () => {
    (inviteUsersFactory as jest.Mock).mockImplementationOnce(() => async () => {
      /* do nothing */
    });

    await handler();
    expect(sendRawEmail).not.toHaveBeenCalled();
  });
});
