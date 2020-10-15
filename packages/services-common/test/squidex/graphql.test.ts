import nock from 'nock';
import { GraphQL } from '../../src/squidex';
import { cms as squidex } from '../../src/config';
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

  it('returns data from the graphql query', async () => {
    nock(squidex.baseUrl)
      .post(
        `/api/content/${squidex.appName}/graphql`,
        JSON.stringify({ query: '{ id }' }),
      )
      .reply(200, {
        data: {
          id: 'id',
        },
      });

    const client = new GraphQL();
    const res = await client.request('{ id }');
    expect(res).toEqual({ id: 'id' });
  });
});
