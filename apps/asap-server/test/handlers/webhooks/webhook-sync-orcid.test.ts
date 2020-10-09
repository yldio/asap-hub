import nock from 'nock';
import matches from 'lodash.matches';
import { APIGatewayProxyResult } from 'aws-lambda';

import {
  handler,
  WebHookPayload,
} from '../../../src/handlers/webhooks/webhook-sync-orcid';
import { apiGatewayEvent } from '../../helpers/events';
import { signPayload } from '../../../src/utils/validate-squidex-request';
import { identity } from '../../helpers/squidex';
import { cms } from '../../../src/config';
import * as fixtures from './webhook-sync-orcid.fixtures';

const createSignedPayload = (payload: WebHookPayload) =>
  apiGatewayEvent({
    httpMethod: 'post',
    headers: {
      'x-signature': signPayload(payload),
    },
    body: payload,
  });

const orcid = '0000-0002-9079-593X';
describe('POST /webhook/users/orcid - validation', () => {
  test('returns 204 when event type is not implemented', async () => {
    const res = (await handler(
      createSignedPayload({
        ...fixtures.createUserEvent,
        type: 'notImplemented',
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });

  test('returns 204 when create doesnt include orcid', async () => {
    const noOrcidEvent = JSON.parse(JSON.stringify(fixtures.createUserEvent));
    delete noOrcidEvent.payload.data.orcid;

    const res = (await handler(
      createSignedPayload(noOrcidEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });

  test('returns 204 when update doesnt change orcid', async () => {
    const res = (await handler(
      createSignedPayload(fixtures.updateUserEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });
});

describe('POST /webhook/users/orcid', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 502 when ORCID returns an error', async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users/userId`)
      .reply(200, fixtures.fetchUserResponse);

    nock('https://pub.orcid.org').get(`/v2.1/${orcid}/works`).reply(500);

    const res = (await handler(
      createSignedPayload(fixtures.createUserEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(502);
    expect(nock.isDone()).toBe(true);
  });

  test('returns 404 when user does not exist', async () => {
    const syncNotFoundEvent = JSON.parse(
      JSON.stringify(fixtures.createUserEvent),
    );
    syncNotFoundEvent.payload.id = 'user-does-not-exist';

    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users/user-does-not-exist`)
      .reply(404);

    const res = (await handler(
      createSignedPayload(syncNotFoundEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(404);
  });

  test('returns 200 when successfully fetches user orcid', async () => {
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, fixtures.orcidWorksResponse);

    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users/userId`)
      .reply(200, fixtures.fetchUserResponse)
      .patch(
        `/api/content/${cms.appName}/users/userId`,
        matches({
          email: { iv: fixtures.fetchUserResponse.data.email.iv },
          orcidLastModifiedDate: {
            iv: `${fixtures.orcidWorksResponse['last-modified-date'].value}`,
          },
          orcidWorks: { iv: fixtures.orcidWorksDeserialisedExpectation },
        }),
      )
      .reply(200, fixtures.fetchUserResponse); // random response - not being asserted

    const res = (await handler(
      createSignedPayload(fixtures.createUserEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
  });

  test('returns 200 when successfully updates user orcid', async () => {
    fixtures.updateUserEvent.payload.data.orcid = { iv: orcid };

    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, fixtures.orcidWorksResponse);

    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/users/userId`)
      .reply(200, fixtures.fetchUserResponse)
      .patch(
        `/api/content/${cms.appName}/users/userId`,
        matches({
          email: { iv: fixtures.fetchUserResponse.data.email.iv },
          orcidLastModifiedDate: {
            iv: `${fixtures.orcidWorksResponse['last-modified-date'].value}`,
          },
          orcidWorks: { iv: fixtures.orcidWorksDeserialisedExpectation },
        }),
      )
      .reply(200, fixtures.fetchUserResponse); // random response - not being asserted

    const res = (await handler(
      createSignedPayload(fixtures.updateUserEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
  });
});
