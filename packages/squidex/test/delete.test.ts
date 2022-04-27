import nock from 'nock';
import config from '../src/config';
import { AsapError } from '@asap-hub/errors';
import { Squidex } from '../src/rest';
import { getAccessTokenMock } from './mocks/access-token.mock';

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
  const client = new Squidex<Content>(collection, getAccessTokenMock);

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns AsapError when squidex returns http error', async () => {
    nock(config.baseUrl)
      .delete(`/api/content/${config.appName}/${collection}/42`)
      .reply(401);

    await expect(() => client.delete('42')).rejects.toThrow(AsapError);
  });

  it('returns AsapError when squidex returns error', async () => {
    nock(config.baseUrl)
      .delete(`/api/content/${config.appName}/${collection}/42`)
      .reply(500);

    await expect(() => client.delete('42')).rejects.toThrow(AsapError);
  });

  it('deletes a specific document', async () => {
    nock(config.baseUrl)
      .delete(`/api/content/${config.appName}/${collection}/42`)
      .reply(204);

    await client.delete('42');
  });
});
