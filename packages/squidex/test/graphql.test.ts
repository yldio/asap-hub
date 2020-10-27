import nock from 'nock';
import config from '../src/config';
import { SquidexGraphql } from '../src/graphql';
import { identity } from './identity';

interface Content {
  id: string;
  data: {
    string: {
      iv: string;
    };
  };
}

describe('squidex wrapper', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns data from the graphql query', async () => {
    nock(config.baseUrl)
      .post(
        `/api/content/${config.appName}/graphql`,
        JSON.stringify({ query: '{ id }' }),
      )
      .reply(200, {
        data: {
          id: 'id',
        },
      });

    const client = new SquidexGraphql();
    const res = await client.request('{ id }');
    expect(res).toEqual({ id: 'id' });
  });
});
