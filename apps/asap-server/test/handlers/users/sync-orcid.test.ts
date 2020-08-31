import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';

import {
  handler,
  WebHookPayload,
} from '../../../src/handlers/users/sync-orcid';
import { apiGatewayEvent } from '../../helpers/events';
import { TestUserResponse, createRandomUser } from '../../helpers/create-user';
import orcidWorksResponse from '../../fixtures/fetch-orcid-works-0000-0002-9079-593X.json';
import createPayloadTemplate from '../../fixtures/users-create-squidex-webhook.json';
import updatePayloadTemplate from '../../fixtures/users-update-squidex-webhook.json';

jest.mock('@asap-hub/auth');

describe('POST /webhook/users', () => {
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
    nock.cleanAll();
  });

  test('returns 502 when ORCID returns an error', async () => {
    nock('https://pub.orcid.org').get(`/v2.1/${orcid}/works`).reply(500);

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: createPayload,
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(502);
  });

  test('returns 404 when user does not exist', async () => {
    createPayload.payload.id = 'user-does-not-exist';

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: createPayload,
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(404);
  });

  test('returns 204 when event type is not implemented', async () => {
    const invalidPayload = Object.assign({}, createPayload);
    invalidPayload.type = 'notImplemented';

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: invalidPayload,
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });

  test('returns 204 when create doesnt include orcid', async () => {
    delete createPayload.payload.data.orcid;

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: createPayload,
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });

  test('returns 204 when update doesnt change orcid', async () => {
    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: updatePayload,
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });

  test('returns 200 when successfully fetches user orcid', async () => {
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, orcidWorksResponse);

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: createPayload,
      }),
    )) as APIGatewayProxyResult;
    const body = JSON.parse(res.body);

    expect(res.statusCode).toStrictEqual(200);
    expect(body.orcidLastModifiedDate).toStrictEqual(
      `${orcidWorksResponse['last-modified-date']?.value}`,
    );
    expect(body.orcidWorks).toContainEqual({
      id: '28076238',
      lastModifiedDate: '1547572516533',
      publicationDate: {
        year: '1965',
      },
      title: 'Properties Of Expanding Universes.',
      type: 'DISSERTATION',
    });
  });

  test('returns 200 when successfully updates user orcid', async () => {
    updatePayload.payload.data.orcid = { iv: orcid };

    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, orcidWorksResponse);

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: updatePayload,
      }),
    )) as APIGatewayProxyResult;
    const body = JSON.parse(res.body);

    expect(res.statusCode).toStrictEqual(200);
    expect(body.orcidLastModifiedDate).toStrictEqual(
      `${orcidWorksResponse['last-modified-date']?.value}`,
    );
    expect(body.orcidWorks).toContainEqual({
      id: '28076238',
      lastModifiedDate: '1547572516533',
      publicationDate: {
        year: '1965',
      },
      title: 'Properties Of Expanding Universes.',
      type: 'DISSERTATION',
    });
  });
});
