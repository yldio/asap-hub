import { GenericError, NotFoundError } from '@asap-hub/errors';
import nock from 'nock';
import { Squidex } from '../rest';
// eslint-disable-next-line jest/no-mocks-import
import { getAccessTokenMock } from '../__mocks__/access-token.mock';

interface Content {
  id: string;
  status: string;
  data: Record<string, unknown>;
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
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("return NotFoundError when document doesn't exist", async () => {
    nock(baseUrl)
      .put(`/api/content/${appName}/${collection}/42/status`)
      .reply(404);

    await expect(client.publish('42')).rejects.toThrow(NotFoundError);
  });

  it('return GenericError on HTTP Error', async () => {
    nock(baseUrl)
      .put(`/api/content/${appName}/${collection}/42/status`)
      .reply(405);

    await expect(client.publish('42')).rejects.toThrow(GenericError);
  });

  it('publishes a specific document', async () => {
    nock(baseUrl)
      .put(`/api/content/${appName}/${collection}/42/status`, {
        status: 'Published',
      })
      .reply(200, {
        id: '42',
        status: 'Published',
      });

    const result = await client.publish('42');

    expect(result).toEqual({
      id: '42',
      status: 'Published',
    });
  });
});
