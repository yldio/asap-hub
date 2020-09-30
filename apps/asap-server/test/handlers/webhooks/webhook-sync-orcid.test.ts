import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';

import {
  handler,
  WebHookPayload,
} from '../../../src/handlers/webhooks/webhook-sync-orcid';
import { apiGatewayEvent } from '../../helpers/events';
import { TestUserResponse, createRandomUser } from '../../helpers/create-user';
import { signPayload } from '../../../src/utils/validate-squidex-request';
import orcidWorksResponse from './fetch-orcid-works.fixtures.json';
import createPayloadTemplate from './users-create-squidex-webhook.fixtures.json';
import updatePayloadTemplate from './users-update-squidex-webhook.fixtures.json';

const createSignedPayload = (payload: WebHookPayload) =>
  apiGatewayEvent({
    httpMethod: 'post',
    headers: {
      'x-signature': signPayload(payload),
    },
    body: payload,
  });

describe('POST /webhook/users/orcid', () => {
  const orcid = '0000-0002-9079-593X';
  let user: TestUserResponse;
  let createPayload: WebHookPayload = createPayloadTemplate;
  let updatePayload: WebHookPayload = updatePayloadTemplate;

  beforeAll(async () => {
    user = await createRandomUser({ orcid });
  });

  beforeEach(() => {
    updatePayload.payload.id = user.id;
    createPayload.payload.id = user.id;
    createPayload.payload.data.orcid = { iv: orcid };
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 502 when ORCID returns an error', async () => {
    nock('https://pub.orcid.org').get(`/v2.1/${orcid}/works`).reply(500);

    const res = (await handler(
      createSignedPayload(createPayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(502);
  });

  test('returns 404 when user does not exist', async () => {
    createPayload.payload.id = 'user-does-not-exist';

    const res = (await handler(
      createSignedPayload(createPayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(404);
  });

  test('returns 204 when event type is not implemented', async () => {
    const invalidPayload = Object.assign({}, createPayload);
    invalidPayload.type = 'notImplemented';

    const res = (await handler(
      createSignedPayload(invalidPayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });

  test('returns 204 when create doesnt include orcid', async () => {
    delete createPayload.payload.data.orcid;

    const res = (await handler(
      createSignedPayload(createPayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });

  test('returns 204 when update doesnt change orcid', async () => {
    const res = (await handler(
      createSignedPayload(updatePayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });

  test('returns 200 when successfully fetches user orcid', async () => {
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, orcidWorksResponse);

    const res = (await handler(
      createSignedPayload(createPayload),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(res.body);

    expect(res.statusCode).toStrictEqual(200);
    expect(body.orcidLastModifiedDate).toStrictEqual(
      `${orcidWorksResponse['last-modified-date']?.value}`,
    );
    expect(body.orcidWorks[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        lastModifiedDate: expect.any(String),
        publicationDate: expect.objectContaining({
          year: expect.any(String),
        }),
        title: expect.any(String),
        type: expect.any(String),
      }),
    );
  });

  test('returns 200 when successfully updates user orcid', async () => {
    updatePayload.payload.data.orcid = { iv: orcid };

    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, orcidWorksResponse);

    const res = (await handler(
      createSignedPayload(updatePayloadTemplate),
    )) as APIGatewayProxyResult;
    const body = JSON.parse(res.body);

    expect(res.statusCode).toStrictEqual(200);
    expect(body.orcidLastModifiedDate).toStrictEqual(
      `${orcidWorksResponse['last-modified-date']?.value}`,
    );
    expect(body.orcidWorks[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        lastModifiedDate: expect.any(String),
        publicationDate: expect.objectContaining({
          year: expect.any(String),
        }),
        title: expect.any(String),
        type: expect.any(String),
      }),
    );
  });
});
