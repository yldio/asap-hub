import nock from 'nock';
import aws from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../../src/handlers/webhooks/webhook-fill-mail-queue';
import { cms } from '../../../src/config';
import { signPayload } from '../../../src/utils/validate-squidex-request';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import * as fixtures from './webhook-fill-mail-queue.fixtures';

jest.mock('aws-sdk', () => ({
  SQS: jest.fn().mockReturnValue({
    sendMessage: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    }),
  }),
}));

const createSignedPayload = (payload: object) =>
  apiGatewayEvent({
    httpMethod: 'post',
    headers: {
      'x-signature': signPayload(payload),
    },
    body: payload,
  });

describe('POST /webhook/users/mails', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when successfully sends all users to the queue', async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 0,
          sort: [{ path: 'data.connections.iv', order: 'ascending' }],
        }),
      })
      .reply(200, fixtures.fetchUsersResponse)
      .get(`/api/content/${cms.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 40,
          skip: 20,
          sort: [{ path: 'data.connections.iv', order: 'ascending' }],
        }),
      })
      .reply(200, { items: [] });

    const sqs = new aws.SQS();
    const res = (await handler(
      createSignedPayload(fixtures.sendEmailsPayload),
    )) as APIGatewayProxyResult;

    const sendMessageListener = jest.spyOn(sqs, 'sendMessage');
    expect(res.statusCode).toStrictEqual(200);
    const receivedMessage = (sendMessageListener.mock
      .calls[0][0] as unknown) as { MessageBody: string };
    expect(sqs.sendMessage).toBeCalledTimes(1);
    expect(JSON.parse(receivedMessage?.MessageBody).length).toBe(4);
  });
});
