import nock from 'nock';
import config from '../src/config';
import { Squidex } from '../src/squidex';
import { identity } from './identity';

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
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns 403 when squidex returns with credentials error', async () => {
    nock(config.baseUrl)
      .delete(`/api/content/${config.appName}/${collection}/42`)
      .reply(400, {
        details: 'invalid_client',
        statusCode: 400,
      });

    const client = new Squidex<Content>(collection);

    await expect(() => client.delete('42')).rejects.toThrow('Unauthorized');
  });

  it('returns 500 when squidex returns error', async () => {
    nock(config.baseUrl)
      .delete(`/api/content/${config.appName}/${collection}/42`)
      .reply(500);
    const client = new Squidex<Content>(collection);

    await expect(() => client.delete('42')).rejects.toThrow('squidex');
  });

  it('deletes a specific document', async () => {
    nock(config.baseUrl)
      .delete(`/api/content/${config.appName}/${collection}/42`)
      .reply(204);

    const client = new Squidex<Content>(collection);
    await client.delete('42');
  });
});
