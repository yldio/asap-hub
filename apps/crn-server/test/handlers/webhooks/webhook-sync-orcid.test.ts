import nock from 'nock';
import matches from 'lodash.matches';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config, WebhookPayload, User } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/webhooks/webhook-sync-orcid';
import { getApiGatewayEvent } from '../../helpers/events';
import { signPayload } from '../../../src/utils/validate-squidex-request';
import { identity } from '../../helpers/squidex';

import * as fixtures from './webhook-sync-orcid.fixtures';

const createSignedPayload = (payload: WebhookPayload<User>) =>
  getApiGatewayEvent({
    headers: {
      'x-signature': signPayload(payload),
    },
    body: JSON.stringify(payload),
  });

const orcid = '0000-0002-9079-593X';

describe('POST /webhook/users/orcid - validation', () => {
  test('requires type to be set', async () => {
    const res = (await handler(
      createSignedPayload({
        ...fixtures.createUserEvent,
        type: undefined as any,
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(400);
  });

  test('allows additional fields', async () => {
    const res = (await handler(
      createSignedPayload({
        ...fixtures.createUserEvent,
        type: 'notImplemented',
        payload: {
          ...fixtures.createUserEvent.payload,
          additionalField: 'some-more-data',
        },
        // @ts-expect-error testing untyped data
        additionalField2: 'some-data',
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });

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

  test('returns 404 when user does not exist', async () => {
    const syncNotFoundEvent = JSON.parse(
      JSON.stringify(fixtures.createUserEvent),
    );
    syncNotFoundEvent.payload.id = 'user-does-not-exist';

    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users/user-does-not-exist`)
      .reply(404);

    const res = (await handler(
      createSignedPayload(syncNotFoundEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(404);
  });

  test('returns 200 when ORCID returns an error', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users/userId`)
      .reply(200, fixtures.fetchUserResponse)
      .patch(`/api/content/${config.appName}/users/userId`)
      .reply(200, fixtures.fetchUserResponse);

    // persist because got will retry on 5XXs
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .times(2)
      .reply(502);

    const res = (await handler(
      createSignedPayload(fixtures.createUserEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
  });

  test('returns 200 when successfully fetches user orcid', async () => {
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, fixtures.orcidWorksResponse);

    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users/userId`)
      .reply(200, fixtures.fetchUserResponse)
      .patch(
        `/api/content/${config.appName}/users/userId`,
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

    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users/userId`)
      .reply(200, fixtures.fetchUserResponse)
      .patch(
        `/api/content/${config.appName}/users/userId`,
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
