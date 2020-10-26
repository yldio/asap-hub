import { SES } from 'aws-sdk';
import nock from 'nock';
import { config } from '@asap-hub/squidex';
import { identity } from './helpers/squidex';
import inviteUsers from '../src/invite';
import { origin } from '../src/config';
import { fetchUsersResponse } from './invite.fixtures';

jest.mock('aws-sdk', () => ({
  SES: jest.fn().mockReturnValue({
    sendTemplatedEmail: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    }),
  }),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'uuid'),
}));

describe('Invite user', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    jest.clearAllMocks(); // clear call count
    expect(nock.isDone()).toBe(true);
  });

  test('Doesnt send mails when doesnt find users without code', async () => {
    const ses = new SES();
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          filter: {
            path: 'data.role.iv',
            op: 'eq',
            value: 'Staff',
          },
          sort: [{ path: 'data.connections.iv', order: 'ascending' }],
        }),
      })
      .reply(200, { items: [fetchUsersResponse.items[2]] });

    await inviteUsers('Staff');
    expect(ses.sendTemplatedEmail).toBeCalledTimes(0);
  });

  test('Sends emails and fetches users correctly', async () => {
    const ses = new SES();

    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          filter: {
            path: 'data.role.iv',
            op: 'eq',
            value: 'Staff',
          },
          sort: [{ path: 'data.connections.iv', order: 'ascending' }],
        }),
      })
      .reply(200, fetchUsersResponse)
      .patch(`/api/content/${config.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'uuid' }] },
      })
      .reply(200, fetchUsersResponse.items[0])
      .patch(`/api/content/${config.appName}/users/userId2`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'uuid' }] },
      })
      .reply(200, fetchUsersResponse.items[1])
      .get(`/api/content/${config.appName}/users`);

    await inviteUsers('Staff');
    expect(ses.sendTemplatedEmail).toBeCalledTimes(2);
    expect(ses.sendTemplatedEmail).toBeCalledWith({
      Source: 'no-reply@hub.asap.science',
      Destination: {
        ToAddresses: ['testUser@asap.science'],
      },
      Template: 'Welcome',
      TemplateData: JSON.stringify({
        firstName: 'TestUser',
        link: `${origin}/welcome/uuid`,
      }),
    });
  });

  test('Doesnt send mail when fails to write the users code on squidex', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          filter: {
            path: 'data.role.iv',
            op: 'eq',
            value: 'Staff',
          },
          sort: [{ path: 'data.connections.iv', order: 'ascending' }],
        }),
      })
      .reply(200, { items: [fetchUsersResponse.items[0]] })
      .patch(`/api/content/${config.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'uuid' }] },
      })
      .reply(500);

    const ses = new SES();
    await expect(inviteUsers('Staff')).rejects.toThrow();
    expect(ses.sendTemplatedEmail).toBeCalledTimes(0);
  });

  test('Deletes code after failure sending mail', async () => {
    const ses = new SES();
    jest
      .spyOn(ses.sendTemplatedEmail(), 'promise')
      .mockRejectedValue(new Error());

    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          filter: {
            path: 'data.role.iv',
            op: 'eq',
            value: 'Staff',
          },
          sort: [{ path: 'data.connections.iv', order: 'ascending' }],
        }),
      })
      .reply(200, { items: [fetchUsersResponse.items[0]] })
      .patch(`/api/content/${config.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'uuid' }] },
      })
      .reply(200, fetchUsersResponse.items[0])
      .patch(`/api/content/${config.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [] },
      })
      .reply(200, fetchUsersResponse.items[0]);

    await expect(inviteUsers('Staff')).rejects.toThrow();
    expect(ses.sendTemplatedEmail().promise).toBeCalledTimes(1);
  });
});
