import nock from 'nock';
import { config } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import ResearchOutputs, {
  buildGraphQLQueryFetchResearchOutputs,
  buildGraphQLQueryResearchOutput,
} from '../../src/controllers/research-outputs';
import {
  getListResearchOutputResponse,
  getResearchOutputResponse,
  getSquidexResearchOutputGraphqlResponse,
  getSquidexResearchOutputsGraphqlResponse,
} from '../fixtures/research-output.fixtures';

describe('ResearchOutputs controller', () => {
  const researchOutputs = new ResearchOutputs();

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Fetch method', () => {
    test('Should return an empty result when the client returns an empty array of data', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchResearchOutputs(),
        })
        .reply(200, {
          data: {
            queryResearchOutputsContentsWithTotal: {
              total: 0,
              items: [],
            },
          },
        });

      const result = await researchOutputs.fetch({ take: 8, skip: 0 });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return the list of research outputs', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchResearchOutputs(),
        })
        .reply(200, {
          data: getSquidexResearchOutputsGraphqlResponse(),
        });

      const result = await researchOutputs.fetch({ take: 8, skip: 0 });

      expect(result).toEqual(getListResearchOutputResponse());
    });

    test('Should return the list of research outputs when using search and filter', async () => {
      const expectedFilter =
        "(data/type/iv eq 'Proposal' or data/type/iv eq 'Presentation') " +
        "and (contains(data/title/iv, 'Title') or contains(data/tags/iv, 'Title'))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchResearchOutputs(expectedFilter),
        })
        .reply(200, {
          data: getSquidexResearchOutputsGraphqlResponse(),
        });

      const result = await researchOutputs.fetch({
        take: 8,
        skip: 0,
        search: 'Title',
        filter: ['Proposal', 'Presentation'],
      });

      expect(result).toEqual(getListResearchOutputResponse());
    });

    test('Should return the list of research outputs when using search with multiple words', async () => {
      const expectedFilter =
        "(contains(data/title/iv, 'some') or contains(data/tags/iv, 'some') or contains(data/title/iv, 'words') or contains(data/tags/iv, 'words'))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchResearchOutputs(expectedFilter),
        })
        .reply(200, {
          data: getSquidexResearchOutputsGraphqlResponse(),
        });

      const result = await researchOutputs.fetch({
        take: 8,
        skip: 0,
        search: 'some words',
      });

      expect(result).toEqual(getListResearchOutputResponse());
    });

    test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
      const expectedFilter =
        "(contains(data/title/iv, '%27%27') or contains(data/tags/iv, '%27%27'))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchResearchOutputs(expectedFilter),
        })
        .reply(200, {
          data: getSquidexResearchOutputsGraphqlResponse(),
        });

      const result = await researchOutputs.fetch({
        take: 8,
        skip: 0,
        search: "'",
      });

      expect(result).toEqual(getListResearchOutputResponse());
    });

    test('Should sanitise double quotation mark by encoding to hex', async () => {
      const expectedFilter =
        "(contains(data/title/iv, '%22') or contains(data/tags/iv, '%22'))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchResearchOutputs(expectedFilter),
        })
        .reply(200, {
          data: getSquidexResearchOutputsGraphqlResponse(),
        });

      const result = await researchOutputs.fetch({
        take: 8,
        skip: 0,
        search: '"',
      });

      expect(result).toEqual(getListResearchOutputResponse());
    });
  });

  describe('Fetch-by-ID method', () => {
    const researchOutputId = 'uuid';

    test('Should throw a Not Found error when the research output is not found', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, {
          data: {
            findResearchOutputsContent: null,
          },
        });

      await expect(researchOutputs.fetchById(researchOutputId)).rejects.toThrow(
        'Not Found',
      );
    });

    test('Should return the research output and the team', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: getSquidexResearchOutputGraphqlResponse() });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result).toEqual(getResearchOutputResponse());
    });

    test('Should default team displayName to an empty string when not present', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      (squidexGraphqlResponse.findResearchOutputsContent
        .referencingTeamsContents![0].flatData!.displayName as string | null) =
        null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.team?.displayName).toEqual('');
    });

    test('Should default type to Proposal and title to an empty string when missing', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      delete squidexGraphqlResponse.findResearchOutputsContent.flatData?.type;
      delete squidexGraphqlResponse.findResearchOutputsContent.flatData?.title;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.title).toEqual('');
      expect(result.type).toEqual('Proposal');
    });

    test('Should default sharingStatus to Public when missing', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      delete squidexGraphqlResponse.findResearchOutputsContent.flatData?.sharingStatus;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.sharingStatus).toEqual('Public');
    });

    test('Should default authors to an empty array when missing', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      delete squidexGraphqlResponse.findResearchOutputsContent.flatData
        ?.authors;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.authors).toEqual([]);
    });

    test('Should return the research output without the team', async () => {
      const researchOutputResponse = getSquidexResearchOutputGraphqlResponse();
      researchOutputResponse.findResearchOutputsContent.referencingTeamsContents =
        [];

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: researchOutputResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      const expectedResult = getResearchOutputResponse();
      expectedResult.team = undefined;
      expectedResult.teams = [];

      expect(result).toEqual(expectedResult);
    });

    describe('Last Updated Partial field', () => {
      test('Should default to last-modified if the last-updated-partial is not present', async () => {
        const researchOutputResponse =
          getSquidexResearchOutputGraphqlResponse();
        delete researchOutputResponse.findResearchOutputsContent.flatData
          ?.lastUpdatedPartial;

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: buildGraphQLQueryResearchOutput(researchOutputId),
          })
          .reply(200, { data: researchOutputResponse });

        const result = await researchOutputs.fetchById(researchOutputId);

        expect(result.lastUpdatedPartial).toEqual(
          researchOutputResponse.findResearchOutputsContent.lastModified,
        );
      });

      test('Should default to created-date if the last-updated-partial and last-modified are not present', async () => {
        const researchOutputResponse =
          getSquidexResearchOutputGraphqlResponse();
        delete researchOutputResponse.findResearchOutputsContent.flatData
          ?.lastUpdatedPartial;
        delete (researchOutputResponse.findResearchOutputsContent as any)
          .lastModified;

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: buildGraphQLQueryResearchOutput(researchOutputId),
          })
          .reply(200, { data: researchOutputResponse });

        const result = await researchOutputs.fetchById(researchOutputId);

        expect(result.lastUpdatedPartial).toEqual(
          researchOutputResponse.findResearchOutputsContent.created,
        );
      });
    });
  });
});
