import nock from 'nock';
import { GenericError } from '@asap-hub/errors';
import { Squidex } from '../rest';
// eslint-disable-next-line jest/no-mocks-import
import { getAccessTokenMock } from '../__mocks__/access-token.mock';

interface Content {
  id: string;
  data: {
    string: {
      iv: string;
    };
  };
}

const collection = 'contents';
describe('squidex wrapper', () => {
  const appName = 'test-app';
  const baseUrl = 'http://test-url.com';
  const client = new Squidex<Content>(getAccessTokenMock, collection, {
    appName,
    baseUrl,
  });

  afterEach(() => {
    // eslint-disable-next-line jest/no-standalone-expect
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns GenericError when squidex returns http error', async () => {
    nock(baseUrl).delete(`/api/content/${appName}/${collection}/42`).reply(401);

    await expect(() => client.delete('42')).rejects.toThrow(GenericError);
  });

  it('returns GenericError when squidex returns error', async () => {
    nock(baseUrl).delete(`/api/content/${appName}/${collection}/42`).reply(500);

    await expect(() => client.delete('42')).rejects.toThrow(GenericError);
  });

  it('deletes a specific document', async () => {
    nock(baseUrl).delete(`/api/content/${appName}/${collection}/42`).reply(204);

    await expect(client.delete('42')).resolves.toBeUndefined();
  });
});
