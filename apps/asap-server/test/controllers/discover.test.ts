import nock from 'nock';
import Discover from '../../src/controllers/discover';
import { config } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import { DiscoverResponse } from '@asap-hub/model';
import {
  squidexDiscoverResponse,
  discoverResponse,
} from '../fixtures/discover.fixtures';

describe('Discover controller', () => {
  const discover = new Discover();

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  describe('Fetch method', () => {
    test('Should return an empty result', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
        .reply(200, {
          data: {
            queryDiscoverContents: [
              { flatData: { aboutUs: null, pages: null, members: null } },
            ],
          },
        });

      const result = await discover.fetch();

      const expectedResponse: DiscoverResponse = {
        aboutUs: '',
        training: [],
        members: [],
        pages: [],
      };
      expect(result).toEqual(expectedResponse);
    });

    test('Should return an empty result when no resource doesnt exist', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
        .reply(200, {
          data: {
            queryDiscoverContents: [],
          },
        });

      const result = await discover.fetch();

      const expectedResponse: DiscoverResponse = {
        aboutUs: '',
        training: [],
        members: [],
        pages: [],
      };
      expect(result).toEqual(expectedResponse);
    });

    test('Should return the discover information', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
        .reply(200, {
          data: squidexDiscoverResponse,
        });

      const result = await discover.fetch();

      expect(result).toEqual(discoverResponse);
    });
  });
});
