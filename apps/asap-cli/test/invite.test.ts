import { SES } from 'aws-sdk';
import nock from 'nock';
import { config } from '@asap-hub/squidex';
import { identity } from './helpers/squidex';
import inviteUsersFactory from '../src/invite';
import { origin, grantsFromEmail } from '../src/config';
import {
  fetchUsersResponse,
  getFetchUsersWithTeamsResponse,
  getListTeamResponse,
} from './invite.fixtures';

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

const consoleLog = jest.fn().mockImplementation(() => {});
const inviteUsers = inviteUsersFactory(consoleLog);

describe('Invite user', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    jest.clearAllMocks(); // clear call count
    nock.cleanAll();
  });

  test('Doesnt send mails when doesnt find users without code', async () => {
    const ses = new SES();
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          sort: [{ path: 'created', order: 'descending' }],
          filter: {
            path: 'data.role.iv',
            op: 'eq',
            value: 'Staff',
          },
        }),
      })
      .reply(200, { items: [fetchUsersResponse.items[2]] });

    await inviteUsers('Staff');
    expect(ses.sendTemplatedEmail).toBeCalledTimes(0);
  });

  test('Sends emails and fetches users with the role "Staff" correctly', async () => {
    const ses = new SES();

    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          sort: [{ path: 'created', order: 'descending' }],
          filter: {
            path: 'data.role.iv',
            op: 'eq',
            value: 'Staff',
          },
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
      Source: grantsFromEmail,
      Destination: {
        ToAddresses: ['testUser@asap.science'],
      },
      Template: 'Welcome',
      TemplateData: JSON.stringify({
        firstName: 'First',
        link: `${origin}/welcome/uuid`,
      }),
    });
  });

  test('Sends emails and fetches users with no particular role', async () => {
    const ses = new SES();

    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          sort: [{ path: 'created', order: 'descending' }],
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

    await inviteUsers();

    expect(ses.sendTemplatedEmail).toBeCalledTimes(2);
    expect(ses.sendTemplatedEmail).toBeCalledWith({
      Source: grantsFromEmail,
      Destination: {
        ToAddresses: ['testUser@asap.science'],
      },
      Template: 'Welcome',
      TemplateData: JSON.stringify({
        firstName: 'First',
        link: `${origin}/welcome/uuid`,
      }),
    });
  });

  test('Logs invited users and the teams they belong to', async () => {
    const ses = new SES();

    const fetchUsersWithTeamsResponse = getFetchUsersWithTeamsResponse();
    const listTeamResponse = getListTeamResponse();

    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          sort: [{ path: 'created', order: 'descending' }],
        }),
      })
      .reply(200, fetchUsersWithTeamsResponse)
      .get(`/api/content/${config.appName}/teams`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          filter: { path: 'id', op: 'in', value: ['team-id-1', 'team-id-2'] },
        }),
      })
      .reply(200, listTeamResponse)
      .patch(`/api/content/${config.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'uuid' }] },
      })
      .reply(200, fetchUsersWithTeamsResponse.items[0])
      .patch(`/api/content/${config.appName}/users/userId2`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'uuid' }] },
      })
      .reply(200, fetchUsersWithTeamsResponse.items[1])
      .get(`/api/content/${config.appName}/users`);

    await inviteUsers();

    expect(ses.sendTemplatedEmail).toBeCalledTimes(2);
    expect(consoleLog).toBeCalledWith(
      `Invited user ${fetchUsersWithTeamsResponse.items[0]!.data.email.iv} (${
        listTeamResponse.items[0]!.data.displayName.iv
      })`,
    );
    expect(consoleLog).toBeCalledWith(
      `Invited user ${fetchUsersWithTeamsResponse.items[1]!.data.email.iv} (${
        listTeamResponse.items[1]!.data.displayName.iv
      })`,
    );
  });

  test('Logs user teams when they belong to a multiple', async () => {
    const user = {
      id: 'userId1',
      lastModified: '2020-09-25T11:06:27.164Z',
      created: '2020-09-24T11:06:27.164Z',
      data: {
        ...fetchUsersResponse.items[0]!.data,
        teams: {
          iv: [
            {
              id: ['team-id-3', 'team-id-4'],
              role: 'Project Manager' as const,
            },
          ],
        },
      },
    };
    const fetchUserMultipleTeamsResponse = getFetchUsersWithTeamsResponse();
    fetchUserMultipleTeamsResponse.items = [user];

    const listTeamResponse = getListTeamResponse();
    listTeamResponse.items[0]!.id = 'team-id-3';
    listTeamResponse.items[1]!.id = 'team-id-4';

    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          sort: [{ path: 'created', order: 'descending' }],
        }),
      })
      .reply(200, fetchUserMultipleTeamsResponse)
      .get(`/api/content/${config.appName}/teams`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          filter: { path: 'id', op: 'in', value: ['team-id-3', 'team-id-4'] },
        }),
      })
      .reply(200, listTeamResponse)
      .patch(`/api/content/${config.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'uuid' }] },
      })
      .reply(200, getFetchUsersWithTeamsResponse().items[0])
      .get(`/api/content/${config.appName}/users`);

    await inviteUsers();

    expect(consoleLog).toBeCalledWith(
      `Invited user ${user.data.email.iv} (${
        listTeamResponse.items[0]!.data.displayName.iv
      } | ${listTeamResponse.items[1]!.data.displayName.iv})`,
    );
  });

  test('Doesnt send mail when fails to write the users code on squidex', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          sort: [{ path: 'created', order: 'descending' }],
          filter: {
            path: 'data.role.iv',
            op: 'eq',
            value: 'Staff',
          },
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
          sort: [{ path: 'created', order: 'descending' }],
          filter: {
            path: 'data.role.iv',
            op: 'eq',
            value: 'Staff',
          },
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
