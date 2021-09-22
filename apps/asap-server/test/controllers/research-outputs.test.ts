import nock from 'nock';
import { config } from '@asap-hub/squidex';
import { print } from 'graphql';
import { identity } from '../helpers/squidex';
import ResearchOutputs from '../../src/controllers/research-outputs';
import {
  getListResearchOutputResponse,
  getResearchOutputResponse,
  getSquidexResearchOutputGraphqlResponse,
  getSquidexResearchOutputsGraphqlResponse,
} from '../fixtures/research-output.fixtures';
import { graphQlResponseFetchUsers } from '../fixtures/users.fixtures';
import { ResearchOutputResponse } from '@asap-hub/model';
import {
  FETCH_RESEARCH_OUTPUT,
  FETCH_RESEARCH_OUTPUTS,
} from '../../src/queries/research-outputs.queries';
import {
  FetchResearchOutputQuery,
  FetchResearchOutputsQuery,
} from '../../src/gql/graphql';

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
      const mockResponse = getFetchResearchOutputsGraphqlResponse();

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUTS),
          variables: {
            top: 10,
            skip: 5,
            filter: '',
            withTeams: true,
          },
        })
        .reply(200, mockResponse);

      const result = await researchOutputs.fetch({ take: 10, skip: 5 });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const mockResponse = getFetchResearchOutputsGraphqlResponse();
      mockResponse.data.queryResearchOutputsContentsWithTotal = null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUTS),
          variables: {
            top: 10,
            skip: 5,
            filter: '',
            withTeams: true,
          },
        })
        .reply(200, mockResponse);

      const result = await researchOutputs.fetch({ take: 10, skip: 5 });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const mockResponse = getFetchResearchOutputsGraphqlResponse();
      mockResponse.data.queryResearchOutputsContentsWithTotal!.items = null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUTS),
          variables: {
            top: 10,
            skip: 5,
            filter: '',
            withTeams: true,
          },
        })
        .reply(200, mockResponse);

      const result = await researchOutputs.fetch({ take: 10, skip: 5 });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return the list of research outputs', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUTS),
          variables: {
            top: 8,
            skip: 0,
            filter: '',
            withTeams: true,
          },
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
          query: print(FETCH_RESEARCH_OUTPUTS),
          variables: {
            filter: expectedFilter,
            top: 8,
            skip: 0,
            withTeams: true,
          },
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
          query: print(FETCH_RESEARCH_OUTPUTS),
          variables: {
            filter: expectedFilter,
            top: 8,
            skip: 0,
            withTeams: true,
          },
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
          query: print(FETCH_RESEARCH_OUTPUTS),
          variables: {
            filter: expectedFilter,
            top: 8,
            skip: 0,
            withTeams: true,
          },
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
          query: print(FETCH_RESEARCH_OUTPUTS),
          variables: {
            filter: expectedFilter,
            top: 8,
            skip: 0,
            withTeams: true,
          },
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
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
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
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: getSquidexResearchOutputGraphqlResponse() });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result).toEqual(getResearchOutputResponse());
    });

    test('Should default team displayName to an empty string when not present', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      (squidexGraphqlResponse.findResearchOutputsContent!
        .referencingTeamsContents![0].flatData.displayName as string | null) =
        null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.team?.displayName).toEqual('');
    });

    test('Should default type to Proposal and title to an empty string when missing', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      squidexGraphqlResponse.findResearchOutputsContent!.flatData.type = null;
      squidexGraphqlResponse.findResearchOutputsContent!.flatData.title = null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.title).toEqual('');
      expect(result.type).toEqual('Proposal');
    });

    test('Should default sharingStatus to Network Only when missing', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      squidexGraphqlResponse.findResearchOutputsContent!.flatData.sharingStatus =
        null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.sharingStatus).toEqual('Network Only');
    });

    test('Should default asapFunded to undefined when missing', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      squidexGraphqlResponse.findResearchOutputsContent!.flatData.asapFunded =
        null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.asapFunded).not.toBeDefined();
    });

    test('Should default asapFunded "Not Sure" option to undefined', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      squidexGraphqlResponse.findResearchOutputsContent!.flatData!.asapFunded =
        'Not Sure';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.asapFunded).not.toBeDefined();
    });

    test('Should default usedInPublication to undefined when missing', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      squidexGraphqlResponse.findResearchOutputsContent!.flatData.usedInAPublication =
        null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.usedInPublication).not.toBeDefined();
    });

    test('Should default usedInPublication "Not Sure" option to undefined', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      squidexGraphqlResponse.findResearchOutputsContent!.flatData.usedInAPublication =
        'Not Sure';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.usedInPublication).not.toBeDefined();
    });

    test('Should default authors to an empty array when missing', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      squidexGraphqlResponse.findResearchOutputsContent!.flatData.authors =
        null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.authors).toEqual([]);
    });

    test('Should default lab name to an empty string when not present', async () => {
      const squidexGraphqlResponse = getSquidexResearchOutputGraphqlResponse();
      squidexGraphqlResponse.findResearchOutputsContent!.flatData.labs![0].flatData.name =
        null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: squidexGraphqlResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      expect(result.labs![0].name).toEqual('');
    });

    test('Should return the research output without the team', async () => {
      const researchOutputResponse = getSquidexResearchOutputGraphqlResponse();
      researchOutputResponse.findResearchOutputsContent!.referencingTeamsContents =
        [];

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
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
      const squidexUser1 = {
        ...graphQlResponseFetchUsers.data.queryUsersContentsWithTotal.items[0],
        __typename: 'Users',
      } as InternalUser;
      const squidexUser2 = {
        ...graphQlResponseFetchUsers.data.queryUsersContentsWithTotal.items[1],
        __typename: 'Users',
      } as InternalUser;
      const externalAuthor: ExternalUser = {
        __typename: 'ExternalAuthors',
        id: '3099015c-c9ed-40fd-830a-8fe1b6ec0482',
        created: '2021-06-04T09:37:54Z',
        lastModified: '2021-06-04T09:37:54Z',
        flatData: {
          name: 'test external author',
          orcid: '23423423',
        },
      };
      researchOutputResponse.findResearchOutputsContent!.flatData.authors = [
        squidexUser1,
        externalAuthor,
        squidexUser2,
      ];

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
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

    test('Should not return the non-onboarded authors', async () => {
      const researchOutputResponse = getSquidexResearchOutputGraphqlResponse();
      const squidexUser1 = {
        ...graphQlResponseFetchUsers.data.queryUsersContentsWithTotal.items[0],
        __typename: 'Users',
        flatData: {
          ...graphQlResponseFetchUsers.data.queryUsersContentsWithTotal.items[0]
            .flatData,
          onboarded: false,
        },
      } as InternalUser;
      const squidexUser2 = {
        ...graphQlResponseFetchUsers.data.queryUsersContentsWithTotal.items[1],
        __typename: 'Users',
        flatData: {
          ...graphQlResponseFetchUsers.data.queryUsersContentsWithTotal.items[1]
            .flatData,
          onboarded: true,
        },
      } as InternalUser;

      researchOutputResponse.findResearchOutputsContent!.flatData.authors = [
        squidexUser1,
        squidexUser2,
      ];

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: researchOutputResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      const { authors } = getResearchOutputResponse();

      const expectedAuthorsResponse: ResearchOutputResponse['authors'] = [
        authors[1],
      ];

      expect(result.authors).toHaveLength(1);
      expect(result.authors).toEqual(expectedAuthorsResponse);
    });

    test('Should return a list of PM emails', async () => {
      const researchOutputResponse = getSquidexResearchOutputGraphqlResponse();
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: researchOutputResponse });

      const result = await researchOutputs.fetchById(researchOutputId);
      expect(result.pmsEmails).toEqual([
        'pm1@example.com',
        'pm2@example.com',
        'multiple-pms-on-same-team@example.com',
      ]);
    });

    test('PM emails should be deduplicated', async () => {
      const researchOutputResponse = getSquidexResearchOutputGraphqlResponse();
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_RESEARCH_OUTPUT),
          variables: {
            id: researchOutputId,
            withTeams: true,
          },
        })
        .reply(200, { data: researchOutputResponse });

      const result = await researchOutputs.fetchById(researchOutputId);

      // Both these PMs are duplicated in the fixture
      expect(
        result.pmsEmails.filter((email) => email === 'pm1@example.com').length,
      ).toEqual(1);
      expect(
        result.pmsEmails.filter((email) => email === 'pm2@example.com').length,
      ).toEqual(1);
    });

    describe('Last Updated Partial field', () => {
      test('Should default to last-modified if the last-updated-partial is not present', async () => {
        const researchOutputResponse =
          getSquidexResearchOutputGraphqlResponse();
        delete researchOutputResponse.findResearchOutputsContent!.flatData
          .lastUpdatedPartial;

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_RESEARCH_OUTPUT),
            variables: {
              id: researchOutputId,
              withTeams: true,
            },
          })
          .reply(200, { data: researchOutputResponse });

        const result = await researchOutputs.fetchById(researchOutputId);

        expect(result.lastUpdatedPartial).toEqual(
          researchOutputResponse.findResearchOutputsContent!.lastModified,
        );
      });

      test('Should default to created-date if the last-updated-partial and last-modified are not present', async () => {
        const researchOutputResponse =
          getSquidexResearchOutputGraphqlResponse();
        delete researchOutputResponse.findResearchOutputsContent!.flatData
          .lastUpdatedPartial;
        delete (researchOutputResponse.findResearchOutputsContent as any)
          .lastModified;

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_RESEARCH_OUTPUT),
            variables: {
              id: researchOutputId,
              withTeams: true,
            },
          })
          .reply(200, { data: researchOutputResponse });

        const result = await researchOutputs.fetchById(researchOutputId);

        expect(result.lastUpdatedPartial).toEqual(
          researchOutputResponse.findResearchOutputsContent!.created,
        );
      });
    });
  });
});

type FetchResearchOutputsGraphqlResponse = {
  data: FetchResearchOutputsQuery;
};

type FetchResearchOutputsQuery_items = NonNullable<
  FetchResearchOutputsQuery['queryResearchOutputsContentsWithTotal']
>['items'];

const getFetchResearchOutputsGraphqlResponse = (
  items: FetchResearchOutputsQuery_items = [],
  total: number = 0,
): FetchResearchOutputsGraphqlResponse => ({
  data: {
    queryResearchOutputsContentsWithTotal: {
      total,
      items,
    },
  },
});

type Author = NonNullable<
  NonNullable<
    FetchResearchOutputQuery['findResearchOutputsContent']
  >['flatData']['authors']
>[number];
type InternalUser = Extract<Author, { __typename: 'Users' }>;
type ExternalUser = Extract<Author, { __typename: 'ExternalAuthors' }>;
