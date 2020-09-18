import { SES } from 'aws-sdk';
import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';

import { identity } from '../../helpers/squidex';
import { handler } from '../../../src/handlers/webhooks/webhook-send-mails';
import { origin, cms } from '../../../src/config';

import {
  sqsEvent,
  fetchUserResponse,
  fetchUserResponseWithCode,
} from './webhook-send-mails.fixtures';

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

jest.mock('../../../src/config', () => {
  const config = jest.requireActual('../../../src/config');

  return {
    __esModule: true,
    ...config,
    environment: 'production',
  };
});

describe('SQS mail queue event - No mocks', () => {
  test('returns 200 when event has no users', async () => {
    const ses = new SES();

    const sqsEmptyEvent = JSON.parse(JSON.stringify(sqsEvent));
    sqsEmptyEvent['Records'][0].body = '[]';
    const res = (await handler(sqsEmptyEvent)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(ses.sendTemplatedEmail).toBeCalledTimes(0);
  });
});

describe('SQS mail queue event - Mocked', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    jest.clearAllMocks(); // clear call count
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when sends users emails - production environment', async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users/userId1`)
      .reply(200, fetchUserResponse)
      .patch(`/api/content/${cms.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'ASAP|uuid' }] },
      })
      .reply(200, fetchUserResponse)
      .get(`/api/content/${cms.appName}/users/userId2`)
      .reply(200, { ...fetchUserResponse, id: 'userId2' })
      .patch(`/api/content/${cms.appName}/users/userId2`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'ASAP|uuid' }] },
      })
      .reply(200, { ...fetchUserResponse, id: 'userId2' });

    const ses = new SES();
    const res = (await handler(sqsEvent)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
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

  //test('returns 200 when sends users emails - dev environments', async () => {
  //nock(cms.baseUrl)
  //.get(`/api/content/${cms.appName}/users/userId1`)
  //.reply(200, fetchUserResponse)
  //.patch(`/api/content/${cms.appName}/users/userId1`, {
  //email: { iv: 'testUser@asap.science' },
  //connections: { iv: [{ code: 'ASAP|uuid' }] },
  //})
  //.reply(200, fetchUserResponse)
  //.get(`/api/content/${cms.appName}/users/userId2`)
  //.reply(200, { ...fetchUserResponse, id: 'userId2' })
  //.patch(`/api/content/${cms.appName}/users/userId2`, {
  //email: { iv: 'testUser@asap.science' },
  //connections: { iv: [{ code: 'ASAP|uuid' }] },
  //})
  //.reply(200, { ...fetchUserResponse, id: 'userId2' });

  //const ses = new SES();
  //const res = (await handler(sqsEvent)) as APIGatewayProxyResult;

  //expect(res.statusCode).toStrictEqual(200);
  //expect(ses.sendTemplatedEmail).toBeCalledTimes(2);
  //expect(ses.sendTemplatedEmail).toBeCalledWith({
  //Source: 'no-reply@hub.asap.science',
  //Destination: {
  //ToAddresses: ['success@simulator.amazonses.com'],
  //},
  //Template: 'Welcome',
  //TemplateData: JSON.stringify({
  //firstName: 'TestUser',
  //link: `${origin}/welcome/uuid`,
  //}),
  //});
  //});

  test('returns 200 when sends users emails - ignores already sent', async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users/userId1`)
      .reply(200, fetchUserResponse)
      .patch(`/api/content/${cms.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'ASAP|uuid' }] },
      })
      .reply(200, fetchUserResponse)
      .get(`/api/content/${cms.appName}/users/userId2`)
      .reply(200, fetchUserResponseWithCode);

    const ses = new SES();
    const res = (await handler(sqsEvent)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(ses.sendTemplatedEmail).toBeCalledTimes(1);
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

  test('returns 500 when fails to write the users code on squidex', async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users/userId1`)
      .reply(200, fetchUserResponse)
      .patch(`/api/content/${cms.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'ASAP|uuid' }] },
      })
      .reply(500)
      .get(`/api/content/${cms.appName}/users/userId2`)
      .reply(200, { ...fetchUserResponse, id: 'userId2' })
      .patch(`/api/content/${cms.appName}/users/userId2`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'ASAP|uuid' }] },
      })
      .reply(500);

    const ses = new SES();
    const res = (await handler(sqsEvent)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(500);
    expect(ses.sendTemplatedEmail).toBeCalledTimes(0);
  });

  test('returns 500 when fails to send the user email', async () => {
    const ses = new SES();
    jest
      .spyOn(ses.sendTemplatedEmail(), 'promise')
      .mockRejectedValue(new Error());

    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users/userId1`)
      .reply(200, fetchUserResponse)
      .patch(`/api/content/${cms.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'ASAP|uuid' }] },
      })
      .reply(200, fetchUserResponse)
      .get(`/api/content/${cms.appName}/users/userId2`)
      .reply(200, { ...fetchUserResponse, id: 'userId2' })
      .patch(`/api/content/${cms.appName}/users/userId2`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'ASAP|uuid' }] },
      })
      .reply(200, { ...fetchUserResponse, id: 'userId2' })
      .patch(`/api/content/${cms.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [] },
      })
      .reply(200, fetchUserResponse)
      .patch(`/api/content/${cms.appName}/users/userId2`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [] },
      })
      .reply(200, { ...fetchUserResponse, id: 'userId2' });

    const res = (await handler(sqsEvent)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(500);
    expect(ses.sendTemplatedEmail().promise).toBeCalledTimes(2);
  });

  test('returns 500 when fails to send the user email - fails to remove code', async () => {
    const ses = new SES();
    jest
      .spyOn(ses.sendTemplatedEmail(), 'promise')
      .mockRejectedValue(new Error());

    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users/userId1`)
      .reply(200, fetchUserResponse)
      .patch(`/api/content/${cms.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'ASAP|uuid' }] },
      })
      .reply(200, fetchUserResponse)
      .get(`/api/content/${cms.appName}/users/userId2`)
      .reply(200, { ...fetchUserResponse, id: 'userId2' })
      .patch(`/api/content/${cms.appName}/users/userId2`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [{ code: 'ASAP|uuid' }] },
      })
      .reply(200, { ...fetchUserResponse, id: 'userId2' })
      .patch(`/api/content/${cms.appName}/users/userId1`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [] },
      })
      .reply(200, fetchUserResponse)
      .patch(`/api/content/${cms.appName}/users/userId2`, {
        email: { iv: 'testUser@asap.science' },
        connections: { iv: [] },
      })
      .reply(500);

    const res = (await handler(sqsEvent)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(500);
    expect(ses.sendTemplatedEmail().promise).toBeCalledTimes(2);
  });
});
