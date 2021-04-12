import nock from 'nock';
import { config, RestResearchOutput, RestTeam } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import ResearchOutputs from '../../src/controllers/research-outputs';
import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';

describe('ResearchOutputs controller', () => {
  const researchOutputs = new ResearchOutputs();

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  describe('Fetch method', () => {
    test('Should return an empty result when the client returns an empty array of data', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/research-outputs`)
        .query({
          $top: 8,
          $skip: 0,
          $orderby: 'created desc',
          $filter: '',
        })
        .reply(200, { total: 0, items: [] });

      const result = await researchOutputs.fetch({ take: 8, skip: 0 });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return the list of research outputs', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/research-outputs`)
        .query({
          $top: 8,
          $skip: 0,
          $orderby: 'created desc',
          $filter: '',
        })
        .reply(200, {
          total: 1,
          items: [
            {
              id: 'uuid',
              created: '2020-09-23T16:34:26.842Z',
              data: {
                type: { iv: 'Proposal' },
                title: { iv: 'Title' },
                text: { iv: 'Text' },
                link: { iv: 'test' },
                tags: {
                  iv: ['tag', 'test'],
                },
              },
            },
          ],
        } as { total: number; items: RestResearchOutput[] })
        .get(`/api/content/${config.appName}/teams`)
        .query(() => true)
        .reply(200, {
          total: 1,
          items: [
            {
              id: 'uuid',
              created: '2020-09-23T16:34:26.842Z',
              lastModified: '2020-09-23T16:34:26.842Z',
              data: {
                displayName: { iv: 'Unknown' },
                applicationNumber: { iv: 'APP' },
              },
            },
          ],
        } as { total: number; items: RestTeam[] });

      const result = await researchOutputs.fetch({ take: 8, skip: 0 });

      const expectedResult: ListResearchOutputResponse = {
        total: 1,
        items: [
          {
            created: '2020-09-23T16:34:26.842Z',
            id: 'uuid',
            text: 'Text',
            title: 'Title',
            type: 'Proposal',
            link: 'test',
            tags: ['tag', 'test'],
          },
        ],
      };

      expect(result).toEqual(expectedResult);
    });

    test('Should return the list of research outputs when using search and filter', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/research-outputs`)
        .query({
          $top: 8,
          $skip: 0,
          $orderby: 'created desc',
          $filter: [
            "(data/type/iv eq 'Proposal' or data/type/iv eq 'Presentation')",
            "(contains(data/title/iv, 'Title') or contains(data/tags/iv, 'Title'))",
          ].join(' and '),
        })
        .reply(200, {
          total: 3,
          items: [
            {
              id: 'uuid-1',
              created: '2020-09-23T16:34:26.842Z',
              data: {
                type: { iv: 'Proposal' },
                title: { iv: 'Title' },
                text: { iv: 'Text' },
                tags: {
                  iv: ['tag', 'test'],
                },
              },
            },
            {
              id: 'uuid-2',
              created: '2020-09-23T16:34:26.842Z',
              data: {
                type: { iv: 'Proposal' },
                title: { iv: 'Title' },
                text: { iv: 'Text' },
              },
            },
            {
              id: 'uuid-3',
              created: '2020-09-23T16:34:26.842Z',
              data: {
                type: { iv: 'Proposal' },
                title: { iv: 'Title' },
                text: { iv: 'Text' },
                tags: {
                  iv: [],
                },
              },
            },
          ],
        } as { total: number; items: RestResearchOutput[] })
        .get(`/api/content/${config.appName}/teams`)
        .query(() => true)
        .reply(200, {
          total: 2,
          items: [
            {
              id: 'uuid-team-1',
              created: '2020-09-23T16:34:26.842Z',
              lastModified: '2020-09-23T16:34:26.842Z',
              data: {
                displayName: { iv: 'Team 1' },
                applicationNumber: { iv: 'APP' },
                outputs: {
                  iv: ['uuid-1', 'uuid-3'],
                },
              },
            },
            {
              id: 'uuid-team-2',
              created: '2020-09-23T16:34:26.842Z',
              lastModified: '2020-09-23T16:34:26.842Z',
              data: {
                displayName: { iv: 'Team 2' },
                applicationNumber: { iv: 'APP' },
                outputs: {
                  iv: ['uuid-2'],
                },
              },
            },
          ],
        } as { total: number; items: RestTeam[] });

      const result = await researchOutputs.fetch({
        take: 8,
        skip: 0,
        search: 'Title',
        filter: ['Proposal', 'Presentation'],
      });

      const expectedResult: ListResearchOutputResponse = {
        total: 3,
        items: [
          {
            created: '2020-09-23T16:34:26.842Z',
            id: 'uuid-1',
            text: 'Text',
            title: 'Title',
            type: 'Proposal',
            tags: ['tag', 'test'],
            team: {
              id: 'uuid-team-1',
              displayName: 'Team 1',
            },
          },
          {
            created: '2020-09-23T16:34:26.842Z',
            id: 'uuid-2',
            text: 'Text',
            title: 'Title',
            type: 'Proposal',
            tags: [],
            team: {
              id: 'uuid-team-2',
              displayName: 'Team 2',
            },
          },
          {
            created: '2020-09-23T16:34:26.842Z',
            id: 'uuid-3',
            text: 'Text',
            title: 'Title',
            type: 'Proposal',
            tags: [],
            team: {
              id: 'uuid-team-1',
              displayName: 'Team 1',
            },
          },
        ],
      };

      expect(result).toEqual(expectedResult);
    });

    test('Should return the list of research outputs when using search with multiple words', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/research-outputs`)
        .query({
          $top: 8,
          $skip: 0,
          $orderby: 'created desc',
          $filter:
            "(contains(data/title/iv, 'some') or contains(data/tags/iv, 'some') or contains(data/title/iv, 'words') or contains(data/tags/iv, 'words'))",
        })
        .reply(200, {
          total: 1,
          items: [
            {
              id: 'uuid-1',
              created: '2020-09-23T16:34:26.842Z',
              data: {
                type: { iv: 'Proposal' },
                title: { iv: 'Title' },
                text: { iv: 'Text' },
                tags: {
                  iv: ['tag', 'test'],
                },
              },
            },
          ],
        } as { total: number; items: RestResearchOutput[] })
        .get(`/api/content/${config.appName}/teams`)
        .query(() => true)
        .reply(200, {
          total: 1,
          items: [
            {
              id: 'uuid-team-1',
              created: '2020-09-23T16:34:26.842Z',
              lastModified: '2020-09-23T16:34:26.842Z',
              data: {
                displayName: { iv: 'Team 1' },
                applicationNumber: { iv: 'APP' },
                outputs: {
                  iv: ['uuid-1', 'uuid-3'],
                },
              },
            },
          ],
        } as { total: number; items: RestTeam[] });

      const result = await researchOutputs.fetch({
        take: 8,
        skip: 0,
        search: 'some words',
      });

      const expectedResult: ListResearchOutputResponse = {
        total: 1,
        items: [
          {
            created: '2020-09-23T16:34:26.842Z',
            id: 'uuid-1',
            text: 'Text',
            title: 'Title',
            type: 'Proposal',
            tags: ['tag', 'test'],
            team: {
              id: 'uuid-team-1',
              displayName: 'Team 1',
            },
          },
        ],
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Fetch-by-ID method', () => {
    const researchOutputId = 'uuid';

    test('Should throw a Not Found error when the research output is not found', async () => {
      nock(config.baseUrl)
        .get(
          `/api/content/${config.appName}/research-outputs/${researchOutputId}`,
        )
        .reply(404);

      await expect(researchOutputs.fetchById(researchOutputId)).rejects.toThrow(
        'Not Found',
      );
    });

    test('Should return the research output and the team', async () => {
      nock(config.baseUrl)
        .get(
          `/api/content/${config.appName}/research-outputs/${researchOutputId}`,
        )
        .reply(200, {
          id: 'uuid',
          created: '2020-09-23T16:34:26.842Z',
          data: {
            type: { iv: 'Proposal' },
            title: { iv: 'Title' },
            text: { iv: 'Text' },
            tags: {
              iv: ['tag', 'test'],
            },
          },
        })
        .get(`/api/content/${config.appName}/teams`)
        .query({
          q: JSON.stringify({
            take: 1,
            filter: {
              path: 'data.outputs.iv',
              op: 'eq',
              value: 'uuid',
            },
          }),
        })
        .reply(200, {
          items: [
            {
              id: 'uuid-team',
              created: '2020-09-23T16:34:26.842Z',
              data: {
                displayName: { iv: 'team' },
                outputs: {
                  iv: ['uuid'],
                },
              },
            },
          ],
        });

      const result = await researchOutputs.fetchById(researchOutputId);

      const expectedResult: ResearchOutputResponse = {
        created: '2020-09-23T16:34:26.842Z',
        id: 'uuid',
        text: 'Text',
        title: 'Title',
        type: 'Proposal',
        tags: ['tag', 'test'],
        team: {
          id: 'uuid-team',
          displayName: 'team',
        },
      };
      expect(result).toEqual(expectedResult);
    });

    test('Should return the research output without the team', async () => {
      nock(config.baseUrl)
        .get(
          `/api/content/${config.appName}/research-outputs/${researchOutputId}`,
        )
        .reply(200, {
          id: 'uuid',
          created: '2020-09-23T16:34:26.842Z',
          data: {
            type: { iv: 'Proposal' },
            title: { iv: 'Title' },
            text: { iv: 'Text' },
            tags: {
              iv: ['tag', 'test'],
            },
          },
        })
        .get(`/api/content/${config.appName}/teams`)
        .query({
          q: JSON.stringify({
            take: 1,
            filter: {
              path: 'data.outputs.iv',
              op: 'eq',
              value: 'uuid',
            },
          }),
        })
        .reply(200, {
          items: [],
        });

      const result = await researchOutputs.fetchById(researchOutputId);

      const expectedResult: ResearchOutputResponse = {
        created: '2020-09-23T16:34:26.842Z',
        id: 'uuid',
        text: 'Text',
        title: 'Title',
        type: 'Proposal',
        tags: ['tag', 'test'],
      };

      expect(result).toEqual(expectedResult);
    });
  });
});
