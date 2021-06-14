import nock from 'nock';
import { config, GraphqlUser } from '@asap-hub/squidex';
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
import { graphQlResponseFetchUsers } from '../fixtures/users.fixtures';
import { GraphqlWithTypename } from '@asap-hub/squidex/src/entities/common';
import { GraphqlExternalAuthor } from '@asap-hub/squidex/src/entities/external-author';
import { ResearchOutputResponse } from '@asap-hub/model';

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

    test('Should default sharingStatus to Network Only when missing', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      delete squidexGraphqlResponse.findResearchOutputsContent.flatData
        ?.sharingStatus;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.sharingStatus).toEqual('Network Only');
    });

    test('Should default asapFunded to undefined when missing', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      delete squidexGraphqlResponse.findResearchOutputsContent.flatData
        ?.asapFunded;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.asapFunded).not.toBeDefined();
    });

    test('Should default asapFunded "Not Sure" option to undefined', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      squidexGraphqlResponse.findResearchOutputsContent.flatData!.asapFunded =
        'Not Sure';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.asapFunded).not.toBeDefined();
    });

    test('Should default usedInPublication to undefined when missing', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      delete squidexGraphqlResponse.findResearchOutputsContent.flatData
        ?.usedInAPublication;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.usedInPublication).not.toBeDefined();
    });

    test('Should default usedInPublication "Not Sure" option to undefined', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      squidexGraphqlResponse.findResearchOutputsContent.flatData!.usedInAPublication =
        'Not Sure';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.usedInPublication).not.toBeDefined();
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
      expectedResult.pmsEmails = []; // as there are no referencing teams, there won't be any PMs

      expect(result).toEqual(expectedResult);
    });

    test('Should return a mix of internal and external authors', async () => {
      const researchOutputResponse = getSquidexResearchOutputGraphqlResponse();
      const squidexUser1: GraphqlWithTypename<GraphqlUser, 'Users'> = {
        ...graphQlResponseFetchUsers.data.queryUsersContentsWithTotal.items[0],
        __typename: 'Users',
      };
      const squidexUser2: GraphqlWithTypename<GraphqlUser, 'Users'> = {
        ...graphQlResponseFetchUsers.data.queryUsersContentsWithTotal.items[1],
        __typename: 'Users',
      };
      const externalAuthor: GraphqlWithTypename<
        GraphqlExternalAuthor,
        'ExternalAuthors'
      > = {
        __typename: 'ExternalAuthors',
        id: '3099015c-c9ed-40fd-830a-8fe1b6ec0482',
        created: '2021-06-04T09:37:54Z',
        lastModified: '2021-06-04T09:37:54Z',
        flatData: {
          name: 'test external author',
          orcid: '23423423',
        },
      };
      researchOutputResponse.findResearchOutputsContent.flatData!.authors = [
        squidexUser1,
        externalAuthor,
        squidexUser2,
      ];

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: researchOutputResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      const { authors } = getResearchOutputResponse();

      const expectedAuthorsResponse: ResearchOutputResponse['authors'] = [
        authors[0],
        {
          displayName: externalAuthor.flatData!.name!,
          orcid: externalAuthor.flatData!.orcid!,
        },
        authors[1],
      ];

      expect(result.authors).toEqual(expectedAuthorsResponse);
    });

    test('Should return a list of PM emails', async () => {
      const researchOutputResponse = getSquidexResearchOutputGraphqlResponse();
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryResearchOutput(researchOutputId),
        })
        .reply(200, { data: researchOutputResponse });

      const result = await researchOutputs.fetchById(researchOutputId);
      expect(result.pmsEmails).toEqual(['pm1@example.com', 'pm2@example.com']);
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
