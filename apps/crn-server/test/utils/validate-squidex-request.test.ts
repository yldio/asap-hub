import validateRequest from '../../src/utils/validate-squidex-request';
import Boom from '@hapi/boom';

const webhookPayload = {
  type: 'NewsCreated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Created',
    id: 'd2b105fe-1255-4f6c-9dfe-c7c7ab9811e3',
    created: '2020-09-03T11:00:51Z',
    lastModified: '2020-09-03T11:00:51Z',
    createdBy: 'subject:5ef5d2fe75c5460001445b65',
    lastModifiedBy: 'subject:5ef5d2fe75c5460001445b65',
    data: {
      title: {
        iv: 'exists-in-dev',
      },
    },
    status: 'Draft',
    partition: -1190432355,
    schemaId: 'd7175bf9-f45c-49ee-9adb-b0e1435bfd2b,news',
    actor: 'subject:5ef5d2fe75c5460001445b65',
    appId: '83f93384-baf4-47a2-ac11-171b161d0fdc,asap-test',
    timestamp: '2020-09-03T11:00:51Z',
    name: 'NewsCreated',
    version: 0,
  },
  timestamp: '2020-09-03T11:00:51Z',
};

describe('Verifies Squidex webhook payload signature', () => {
  test('throws 403 when X-Signature header is not defined', async () => {
    expect(() =>
      validateRequest({
        method: 'post',
        headers: {},
        payload: webhookPayload,
      }),
    ).toThrow(Boom.unauthorized());
  });

  test('throws 401 when X-Signature header does not match', async () => {
    expect(() =>
      validateRequest({
        method: 'post',
        headers: {
          'x-signature': 'invalidSignature',
        },
        payload: webhookPayload,
      }),
    ).toThrow(Boom.forbidden());
  });

  test('returns true when signature is valid', async () => {
    const res = validateRequest({
      method: 'post',
      headers: {
        'x-signature': 'JXApQoo8MlxD0FAV6+gZRMulLll9HnjDLgZN41wLEH4=',
      },
      payload: webhookPayload,
    });
    expect(res).toBe(true);
  });
});
