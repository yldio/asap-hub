import Chance from 'chance';
import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';

import { handler } from '../../../src/handlers/users/sync-orcid';
import { apiGatewayEvent } from '../../helpers/events';
import { createRandomUser } from '../../helpers/create-user';
import orcidWorksResponse from '../../fixtures/fetch-orcid-works-0000-0002-9079-593X.json';
import createPayloadTemplate from '../../fixtures/users-create-squidex-webhook.json';
import updatePayloadTemplate from '../../fixtures/users-update-squidex-webhook.json';
import { CMS } from '../../../src/cms';

jest.mock('@asap-hub/auth');

const chance = new Chance();
const cms = new CMS();

describe('POST /webhook/users', () => {
  const orcid = '0000-0002-9079-593X';
  let code, user;
  let createPayload = createPayloadTemplate;
  let updatePayload = updatePayloadTemplate;

  beforeAll(async () => {
    user = await createRandomUser({ orcid });
  });

  beforeEach(() => {
    updatePayload.payload.id = user.id;
    createPayload.payload.id = user.id;
    createPayload.payload.data.orcid = { iv: orcid };
  });

  afterEach(() => nock.cleanAll());

  test('returns 501 when event type is not implemented', async () => {
    const invalidPayload = Object.assign({}, createPayload);
    invalidPayload.type = 'notImplemented';

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: invalidPayload,
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(501);
  });

  test('returns 502 when ORCID returns an error', async () => {
    nock('https://pub.orcid.org').get(`/v2.1/${orcid}/works`).reply(500);

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: createPayload,
      }),
      null,
      null,
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
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(404);
  });

  test('returns 204 when create doesnt include orcid', async () => {
    delete createPayload.payload.data.orcid;

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: createPayload,
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });

  test('returns 204 when update doesnt change orcid', async () => {
    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: updatePayload,
      }),
      null,
      null,
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
      null,
      null,
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
      null,
      null,
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
