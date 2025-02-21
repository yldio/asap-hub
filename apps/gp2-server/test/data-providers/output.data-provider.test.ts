import {
  addLocaleToFields,
  Entry,
  Environment,
  getGP2ContentfulGraphqlClientMockServer,
  gp2 as gp2Contentful,
  patchAndPublish,
} from '@asap-hub/contentful';
import { GenericError } from '@asap-hub/errors';
import { gp2 as gp2Model } from '@asap-hub/model';
import { OutputVersionCoreObject } from '@asap-hub/model/src/gp2';
import {
  OutputContentfulDataProvider,
  OutputItem,
} from '../../src/data-providers/output.data-provider';
import { OutputDataProvider } from '../../src/data-providers/types';
import { getEntry } from '../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlOutput,
  getContentfulOutputsGraphqlResponse,
  getOutputCreateDataObject,
  getOutputDataObject,
  getOutputUpdateDataObject,
} from '../fixtures/output.fixtures';
import { getContentfulGraphqlClientMock } from '../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../mocks/contentful-rest-client.mock';
jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  patchAndPublish: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../src/utils/logger');

const makeLink = (id?: string) => ({
  sys: { type: 'Link', linkType: 'Entry', id },
});
describe('Outputs data provider', () => {
  const graphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const restClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const outputDataProvider: OutputDataProvider =
    new OutputContentfulDataProvider(graphqlClientMock, restClientMock);

  const outputGraphqlResponse = getContentfulGraphqlOutput();
  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      Outputs: () => ({
        ...outputGraphqlResponse,
        relatedOutputsCollection: () =>
          outputGraphqlResponse.relatedOutputsCollection,
        linkedFrom: () => outputGraphqlResponse.linkedFrom,
      }),
      OutputsCollection: () => {
        return {
          total: 1,
          items: [{}],
        };
      },
    });
  const outputDataProviderWithMockServer: OutputDataProvider =
    new OutputContentfulDataProvider(
      contentfulGraphqlClientMockServer,
      restClientMock,
    );

  beforeEach(jest.resetAllMocks);

  describe('Fetch by ID method', () => {
    const outputId = 'some-uuid';

    test('Should fetch the output from graphql', async () => {
      const result = await outputDataProviderWithMockServer.fetchById(outputId);

      expect(result).toMatchObject({
        ...getOutputDataObject(),
        relatedOutputs: [
          {
            documentType: 'Dataset',
            entity: {
              id: 'project-id',
              title: 'A Project',
              type: 'Projects',
            },
            id: 'another-output-id',
            title: 'another title',
            type: 'Research',
          },
          {
            documentType: 'Article',
            entity: {
              id: 'project-id',
              title: 'A Project',
              type: 'Projects',
            },
            id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
            title: 'Test Proposal 1234',
            type: 'Research',
          },
        ],
      });
    });
    test('Should return null when the output is not found', async () => {
      graphqlClientMock.request.mockResolvedValueOnce({
        outputs: null,
      });

      expect(await outputDataProvider.fetchById('not-found')).toBeNull();
    });

    test('should return the output', async () => {
      const graphqlResponse = getContentfulGraphqlOutput();
      graphqlClientMock.request.mockResolvedValueOnce({
        outputs: graphqlResponse,
      });

      const result = await outputDataProvider.fetchById(outputId);
      const expectedResult = getOutputDataObject();

      expect(result).toEqual(expectedResult);
    });
    describe('related outputs', () => {
      test.each`
        typename
        ${`WorkingGroups`}
        ${`Projects`}
      `(
        'should return the related output for $type entity',
        async ({ typename }) => {
          const graphqlResponse = getContentfulGraphqlOutput();
          graphqlClientMock.request.mockResolvedValueOnce({
            outputs: {
              ...graphqlResponse,

              linkedFrom: {
                outputsCollection: {
                  items: [
                    {
                      sys: { id: 'related-output-id' },
                      title: 'Related Article',
                      documentType: 'Dataset',
                      relatedEntitiesCollection: {
                        items: [
                          {
                            __typename: typename,
                            sys: {
                              id: 'entity-2',
                            },
                            title: 'Polygenic Risk',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              relatedOutputsCollection: {
                total: 1,
                items: [
                  {
                    sys: { id: 'another-output-id' },
                    title: 'Related Article',
                    documentType: 'Dataset',
                    relatedEntitiesCollection: {
                      items: [
                        {
                          __typename: typename,
                          sys: {
                            id: 'entity-2',
                          },
                          title: 'Polygenic Risk',
                        },
                      ],
                    },
                  },
                ],
              },
            },
          });

          const result = await outputDataProvider.fetchById(outputId);
          const expectedResult = getOutputDataObject();

          expect(result).toEqual({
            ...expectedResult,
            relatedOutputs: [
              {
                documentType: 'Dataset',
                entity: {
                  id: 'entity-2',
                  title: 'Polygenic Risk',
                  type: typename,
                },
                id: 'another-output-id',
                title: 'Related Article',
              },
              {
                documentType: 'Dataset',
                entity: {
                  id: 'entity-2',
                  title: 'Polygenic Risk',
                  type: typename,
                },
                id: 'related-output-id',
                title: 'Related Article',
              },
            ],
          });
        },
      );
      test('should default to empty array', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: {
            ...graphqlResponse,

            relatedOutputsCollection: {
              total: 1,
              items: undefined,
            },
          },
        });

        const result = await outputDataProvider.fetchById(outputId);
        const expectedResult = getOutputDataObject();

        expect(result).toEqual({
          ...expectedResult,
          relatedOutputs: [],
        });
      });
    });
    describe('related events', () => {
      test('Should default related events to an empty array when missing', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlResponse.relatedEventsCollection = null;
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        const result = await outputDataProvider.fetchById('1');

        expect(result!.relatedEvents).toEqual([]);
      });
    });

    describe('Document Types', () => {
      test.each(gp2Model.outputDocumentTypes)(
        'parses the document type %s to %s',
        async (type) => {
          const graphqlResponse = getContentfulGraphqlOutput();
          graphqlResponse!.documentType = type;
          graphqlClientMock.request.mockResolvedValueOnce({
            outputs: graphqlResponse,
          });
          const result = await outputDataProvider.fetchById(outputId);
          expect(result?.documentType).toEqual(type);
        },
      );
    });
    describe('Types', () => {
      test.each(gp2Model.outputTypes)(
        'parses the  type %s to %s',
        async (type) => {
          const graphqlResponse = getContentfulGraphqlOutput();
          graphqlResponse!.documentType = 'Article';
          graphqlResponse!.type = type;
          graphqlClientMock.request.mockResolvedValueOnce({
            outputs: graphqlResponse,
          });
          const result = await outputDataProvider.fetchById(outputId);
          expect(result?.type).toEqual(type);
        },
      );
      test.each(
        gp2Model.outputDocumentTypes.filter((type) => type !== 'Article'),
      )(
        'parses the type to undefined for the document type %s',
        async (type) => {
          const graphqlResponse = getContentfulGraphqlOutput();
          graphqlResponse!.documentType = type;
          graphqlClientMock.request.mockResolvedValueOnce({
            outputs: graphqlResponse,
          });
          const result = await outputDataProvider.fetchById(outputId);
          expect(result?.type).toBeUndefined();
        },
      );
    });
    test.each(gp2Model.outputSubtypes)(
      'parses the sub types %s',
      async (type) => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlResponse!.documentType = 'Article';
        graphqlResponse!.type = 'Research';
        graphqlResponse!.subtype = type;
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });
        const result = await outputDataProvider.fetchById(outputId);
        expect(result?.subtype).toEqual(type);
      },
    );

    test('Should default authors to an empty array when missing', async () => {
      const graphqlResponse = getContentfulGraphqlOutput();
      graphqlResponse!.authorsCollection = null;
      graphqlClientMock.request.mockResolvedValueOnce({
        outputs: graphqlResponse,
      });

      const result = await outputDataProvider.fetchById(outputId);

      expect(result!.authors).toEqual([]);
    });

    test('Should default projects and WG to undefined when related entities is empty', async () => {
      const graphqlResponse = getContentfulGraphqlOutput();
      graphqlResponse!.relatedEntitiesCollection = null;
      graphqlClientMock.request.mockResolvedValueOnce({
        outputs: graphqlResponse,
      });

      const result = await outputDataProvider.fetchById(outputId);

      expect(result!.projects).toEqual(undefined);
      expect(result!.workingGroups).toEqual(undefined);
    });

    test('Should default cohorts to an empty array when missing', async () => {
      const graphqlResponse = getContentfulGraphqlOutput();
      graphqlResponse!.contributingCohortsCollection = null;
      graphqlClientMock.request.mockResolvedValueOnce({
        outputs: graphqlResponse,
      });

      const result = await outputDataProvider.fetchById(outputId);

      expect(result!.contributingCohorts).toEqual([]);
    });

    test('Should default versions to empty array when missing', async () => {
      const graphqlResponse = getContentfulGraphqlOutput();
      graphqlResponse!.versionsCollection = null;
      graphqlClientMock.request.mockResolvedValueOnce({
        outputs: graphqlResponse,
      });

      const result = await outputDataProvider.fetchById(outputId);

      expect(result!.versions).toEqual([]);
    });

    describe('Authors', () => {
      const getInternalUsers = (): InternalUser[] => [
        {
          sys: { id: 'user-id-1' },
          firstName: 'Tony',
          nickname: 'Iron Man',
          lastName: 'Stark',
          email: 'tony.stark@email.com',
          onboarded: true,
          avatar: { url: null },
          __typename: 'Users',
        },
        {
          sys: { id: 'user-id-2' },
          firstName: 'Peter',
          lastName: 'Parker',
          email: 'peter.parker@email.com',
          onboarded: true,
          avatar: { url: null },
          __typename: 'Users',
        },
      ];
      test('Should return a mix of internal and external authors', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        const [user1, user2] = getInternalUsers();
        const externalUser: ExternalUser = {
          __typename: 'ExternalUsers',
          sys: { id: '3099015c-c9ed-40fd-830a-8fe1b6ec0482' },
          name: 'test external user',
        };
        graphqlResponse!.authorsCollection = {
          total: 3,
          items: [user1!, externalUser, user2!],
        };
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        const result = await outputDataProvider.fetchById(outputId);

        const { authors } = getOutputDataObject();

        const expectedAuthorsResponse: gp2Model.OutputDataObject['authors'] = [
          authors[0]!,
          {
            id: '3099015c-c9ed-40fd-830a-8fe1b6ec0482',
            displayName: externalUser!.name!,
          },
          authors[1]!,
        ];

        expect(result!.authors).toEqual(expectedAuthorsResponse);
      });

      test('Should not return the non-onboarded authors', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();

        const [user1, user2] = getInternalUsers();
        user1!.onboarded = false;
        user2!.onboarded = true;
        graphqlResponse!.authorsCollection = {
          total: 2,
          items: [user1!, user2!],
        };
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        const result = await outputDataProvider.fetchById(outputId);

        const { authors } = getOutputDataObject();

        const expectedAuthorsResponse: gp2Model.OutputDataObject['authors'] = [
          authors[1]!,
        ];

        expect(result!.authors).toHaveLength(1);
        expect(result!.authors).toEqual(expectedAuthorsResponse);
      });
      test('Should return internal user avatar', async () => {
        const url = 'http://example.com/avatar-url';
        const graphqlResponse = getContentfulGraphqlOutput();

        const [user1] = getInternalUsers();
        user1!.avatar = { url };
        graphqlResponse!.authorsCollection = {
          total: 1,
          items: [user1!],
        };
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        const result = await outputDataProvider.fetchById(outputId);

        const { authors } = getOutputDataObject();

        const expectedAuthorsResponse = {
          ...authors[0]!,
          avatarUrl: url,
        };
        expect(result!.authors[0]!).toEqual(expectedAuthorsResponse);
      });
    });

    describe('Last Updated Partial field', () => {
      test('Should default to publishedAt if the last-updated-partial is not present', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        delete graphqlResponse!.lastUpdatedPartial;
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        const result = await outputDataProvider.fetchById(outputId);

        expect(result!.lastUpdatedPartial).toEqual(
          graphqlResponse!.sys.publishedAt,
        );
      });

      test('Should default to created-date if the last-updated-partial and publishedAt are not present', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        delete graphqlResponse!.lastUpdatedPartial;
        delete graphqlResponse.sys.publishedAt;
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        const result = await outputDataProvider.fetchById(outputId);

        expect(result!.lastUpdatedPartial).toEqual(
          graphqlResponse!.sys.firstPublishedAt,
        );
      });
    });
    describe('related entities', () => {
      it('should return a project', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlResponse!.relatedEntitiesCollection = {
          total: 1,
          items: [
            {
              __typename: 'Projects',
              sys: {
                id: '42',
              },
              title: 'a project',
            },
          ],
        };
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });
        const result = await outputDataProvider.fetchById(outputId);

        expect(result!.workingGroups).toBeUndefined();
        expect(result!.projects).toEqual([
          {
            id: '42',
            title: 'a project',
          },
        ]);
      });
      it('should return working group', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlResponse!.relatedEntitiesCollection = {
          total: 1,
          items: [
            {
              __typename: 'WorkingGroups',
              sys: {
                id: '42',
              },
              title: 'a working group',
            },
          ],
        };
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });
        const result = await outputDataProvider.fetchById(outputId);

        expect(result!.projects).toBeUndefined();
        expect(result!.workingGroups).toEqual([
          {
            id: '42',
            title: 'a working group',
          },
        ]);
      });
      it('should return empty if undefined', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlResponse!.relatedEntitiesCollection = null;
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });
        const result = await outputDataProvider.fetchById(outputId);

        expect(result!.projects).toBeUndefined();
        expect(result!.workingGroups).toBeUndefined();
      });
    });
    test('Should return empty array for tags if no tags', async () => {
      const graphqlResponse = getContentfulGraphqlOutput();
      graphqlResponse.tagsCollection = null;
      graphqlClientMock.request.mockResolvedValueOnce({
        outputs: graphqlResponse,
      });

      const result = await outputDataProvider.fetchById(outputId);

      expect(result!.tags).toMatchObject([]);
    });

    describe('Sharing Status', () => {
      test('Should default to GP2 Only if the sharingStatus is not present', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        delete graphqlResponse!.sharingStatus;
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        const result = await outputDataProvider.fetchById(outputId);

        expect(result!.sharingStatus).toEqual('GP2 Only');
      });

      test('Should default to GP2 Only if the sharingStatus is not valid', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlResponse!.sharingStatus = 'CRN Only';
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        const result = await outputDataProvider.fetchById(outputId);

        expect(result!.sharingStatus).toEqual('GP2 Only');
      });

      test('Should return sharingStatus when present and valid', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlResponse!.sharingStatus = 'Public';
        graphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        const result = await outputDataProvider.fetchById(outputId);

        expect(result!.sharingStatus).toEqual('Public');
      });
    });
  });

  describe('Fetch method', () => {
    test('Should fetch the output from graphql', async () => {
      const result = await outputDataProviderWithMockServer.fetch({});

      expect(result).toMatchObject({
        total: 1,
        items: [
          {
            ...getOutputDataObject(),
            relatedOutputs: [
              {
                documentType: 'Dataset',
                entity: {
                  id: 'project-id',
                  title: 'A Project',
                  type: 'Projects',
                },
                id: 'another-output-id',
                title: 'another title',
                type: 'Research',
              },
              {
                documentType: 'Article',
                entity: {
                  id: 'project-id',
                  title: 'A Project',
                  type: 'Projects',
                },
                id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
                title: 'Test Proposal 1234',
                type: 'Research',
              },
            ],
          },
        ],
      });
    });

    test('Should return an empty result when the client returns an empty array of data', async () => {
      const graphqlResponse = getContentfulOutputsGraphqlResponse();
      graphqlResponse.outputsCollection!.total = 0;
      graphqlResponse.outputsCollection!.items = [];
      graphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

      const result = await outputDataProvider.fetch({
        take: 10,
        skip: 5,
      });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const graphqlResponse = getContentfulOutputsGraphqlResponse();
      graphqlResponse.outputsCollection = null;
      graphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

      const result = await outputDataProvider.fetch({
        take: 10,
        skip: 5,
      });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test.each(gp2Model.outputDocumentTypes)(
      'Should return the document type %s on Outputs',
      async (documentType) => {
        const graphqlResponse = getContentfulOutputsGraphqlResponse();
        graphqlResponse.outputsCollection!.items![0]!.documentType =
          documentType;
        graphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

        const result = await outputDataProvider.fetch({
          take: 10,
          skip: 0,
        });

        expect(result.items[0]!.documentType).toEqual(documentType);
      },
    );

    describe('Parameters', () => {
      const defaultParams = {
        take: 8,
        skip: 0,
      };
      const expectedDefaultParams = {
        limit: 8,
        skip: 0,
        where: {},
        order: [gp2Contentful.OutputsOrder.AddedDateDesc],
      };

      beforeEach(() => {
        jest.resetAllMocks();
        graphqlClientMock.request.mockResolvedValueOnce(
          getContentfulOutputsGraphqlResponse(),
        );
      });

      test('Should pass the pagination parameters as expected', async () => {
        await outputDataProvider.fetch({ take: 13, skip: 7 });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            limit: 13,
            skip: 7,
          },
        );
      });

      test('Should pass the search parameters', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          search: 'Title',
        });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            where: {
              AND: [{ OR: [{ title_contains: 'Title' }] }],
            },
          },
        );
      });

      test('Should pass the object filter parameter properties', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          filter: {
            documentType: ['Article'],
            title: 'some-title',
            gp2Supported: 'Yes',
            sharingStatus: 'Public',
          },
        });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            where: {
              AND: [
                { title: 'some-title' },
                { documentType_in: ['Article'] },
                { gp2Supported: 'Yes' },
                { sharingStatus: 'Public' },
              ],
            },
          },
        );
      });

      test('Should pass the object filter parameter properties with an array', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          filter: {
            documentType: ['Dataset', 'Article'],
            title: 'some-title',
          },
        });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            where: {
              AND: [
                { title: 'some-title' },
                { documentType_in: ['Dataset', 'Article'] },
              ],
            },
          },
        );
      });

      test('Should pass the search and filter parameter', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          search: 'Title',
          filter: {
            documentType: ['Dataset', 'Article'],
          },
        });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            where: {
              AND: [
                { OR: [{ title_contains: 'Title' }] },
                { documentType_in: ['Dataset', 'Article'] },
              ],
            },
          },
        );
      });

      test('Should break up the search parameter into multiple words and send', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          search: 'some words',
        });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            where: {
              AND: [
                {
                  OR: [{ title_contains: 'some' }, { title_contains: 'words' }],
                },
              ],
            },
          },
        );
      });
      test('filter by link', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          filter: {
            link: 'some-link',
          },
        });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            where: {
              AND: [{ link: 'some-link' }],
            },
          },
        );
      });
      test('filter by working group', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          filter: {
            workingGroupId: 'working-group-id',
          },
        });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS_BY_WORKING_GROUP_ID,
          {
            limit: 8,
            skip: 0,
            id: 'working-group-id',
          },
        );
      });
      test('filter by project', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          filter: {
            projectId: 'project-id',
          },
        });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS_BY_PROJECT_ID,
          {
            limit: 8,
            skip: 0,
            id: 'project-id',
          },
        );
      });
      test('filter by event', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          filter: {
            eventId: 'event-id',
          },
        });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS_BY_EVENT_ID,
          {
            limit: 8,
            skip: 0,
            id: 'event-id',
          },
        );
      });
      test('filter by authors', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          filter: {
            authorId: 'user-id',
          },
        });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS_BY_USER_ID,
          {
            limit: 8,
            skip: 0,
            id: 'user-id',
          },
        );
      });
      test('filter by external authors', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          filter: {
            externalAuthorId: 'external-user-id',
          },
        });

        expect(graphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS_BY_EXTERNAL_USER_ID,
          {
            limit: 8,
            skip: 0,
            id: 'external-user-id',
          },
        );
      });
    });
  });

  describe('Create', () => {
    test('Should send the correct requests and return its ID', async () => {
      const outputRequest = getOutputCreateDataObject();
      const outputId = 'created-output-id';

      const outputMock = getEntry({}, outputId);
      environmentMock.createEntry.mockResolvedValue(outputMock);
      outputMock.publish = jest.fn().mockResolvedValueOnce(outputMock);

      const result = await outputDataProvider.create(outputRequest);
      expect(result).toEqual(outputId);
      const {
        workingGroupIds: _,
        relatedOutputIds,
        relatedEventIds,
        projectIds,
        tagIds,
        contributingCohortIds,
        mainEntityId,
        ...fieldsCreated
      } = outputRequest;
      const fields = addLocaleToFields({
        ...fieldsCreated,
        authors: fieldsCreated.authors.map((author) =>
          makeLink(author.externalUserId || author.userId),
        ),
        createdBy: makeLink(outputRequest.createdBy),
        updatedBy: makeLink(outputRequest.createdBy),
        relatedEntities: [mainEntityId, ...(projectIds || [])]?.map(makeLink),
        tags: tagIds.map(makeLink),
        relatedOutputs: relatedOutputIds.map(makeLink),
        relatedEvents: relatedEventIds.map(makeLink),
        contributingCohorts: contributingCohortIds.map(makeLink),
      });
      expect(environmentMock.createEntry).toHaveBeenCalledWith('outputs', {
        fields,
      });

      expect(outputMock.publish).toHaveBeenCalled();
    });

    test('Should use the correct IDs for authors', async () => {
      const OutputRequest = getOutputCreateDataObject();
      OutputRequest.authors = [
        {
          externalUserId: 'some-external-user-id',
        },
        { userId: 'some-user-id' },
      ];
      const outputMock = getEntry({});
      environmentMock.createEntry.mockResolvedValue(outputMock);
      outputMock.publish = jest.fn().mockResolvedValueOnce(outputMock);

      await outputDataProvider.create(OutputRequest);
      expect(environmentMock.createEntry).toHaveBeenCalledWith('outputs', {
        fields: expect.objectContaining({
          authors: {
            'en-US': [
              makeLink('some-external-user-id'),
              makeLink('some-user-id'),
              ,
            ],
          },
        }),
      });
    });
    test('Should throw when no related entity pass in', async () => {
      const outputRequest = getOutputCreateDataObject();

      await expect(
        outputDataProvider.create({
          ...outputRequest,
          workingGroupIds: undefined,
          projectIds: undefined,
          mainEntityId: undefined as unknown as string,
        }),
      ).rejects.toThrow(/invalid related entities/i);
    });

    test('Should throw when fails to create the output', async () => {
      const outputRequest = getOutputCreateDataObject();
      environmentMock.createEntry.mockRejectedValueOnce(new GenericError());

      await expect(outputDataProvider.create(outputRequest)).rejects.toThrow(
        GenericError,
      );
    });
  });

  describe('Update', () => {
    const outputId = 'updated-output-id';
    const entry = getEntry({
      fields: {
        title: 'Test',
      },
    });

    beforeEach(() => {
      jest.resetAllMocks();
      environmentMock.getEntry.mockResolvedValueOnce(entry);
      const mockPatchAndPublish = patchAndPublish as jest.MockedFunction<
        typeof patchAndPublish
      >;
      mockPatchAndPublish.mockResolvedValue({
        sys: {
          publishedVersion: 2,
        },
      } as Entry);
      graphqlClientMock.request.mockResolvedValue({
        outputs: {
          sys: {
            publishedVersion: 2,
          },
        },
      });
    });

    test('Should update the existing output', async () => {
      const outputUpdateData = getOutputUpdateDataObject();

      await outputDataProvider.update(outputId, outputUpdateData);

      const {
        projectIds,
        relatedEventIds,
        relatedOutputIds,
        mainEntityId,
        contributingCohortIds,
        tagIds,
        ...fieldsUpdated
      } = outputUpdateData;
      const fields = {
        ...fieldsUpdated,
        authors: outputUpdateData.authors.map((author) =>
          makeLink(author.externalUserId || author.userId),
        ),
        updatedBy: makeLink(outputUpdateData.updatedBy),
        relatedEntities: [mainEntityId, ...(projectIds || [])]?.map(makeLink),
        tags: tagIds.map(makeLink),
        relatedOutputs: relatedOutputIds.map(makeLink),
        relatedEvents: relatedEventIds.map(makeLink),
        contributingCohorts: contributingCohortIds.map(makeLink),
      };
      expect(patchAndPublish).toHaveBeenCalledWith(entry, {
        ...fields,
      });
      expect(environmentMock.createEntry).toHaveBeenCalledTimes(0);
      expect(environmentMock.createPublishBulkAction).not.toHaveBeenCalled();
      expect(environmentMock.createUnpublishBulkAction).not.toHaveBeenCalled();
      expect(environmentMock.getEntries).not.toHaveBeenCalled();
    });

    test('Should throw when fails to update the output', async () => {
      const OutputRequest = getOutputUpdateDataObject();
      (patchAndPublish as jest.MockedFunction<typeof patchAndPublish>)
        .mockReset()
        .mockRejectedValueOnce(new GenericError());
      await expect(
        outputDataProvider.update(outputId, OutputRequest),
      ).rejects.toThrow(GenericError);
    });
  });

  describe('create Version', () => {
    const mockPatchAndPublish = patchAndPublish as jest.MockedFunction<
      typeof patchAndPublish
    >;
    beforeEach(() => {
      jest.resetAllMocks();

      mockPatchAndPublish.mockResolvedValue({
        sys: {
          publishedVersion: 2,
        },
      } as Entry);
      graphqlClientMock.request.mockResolvedValue({
        outputs: {
          sys: {
            publishedVersion: 2,
          },
        },
      });
    });
    const baseVersion: OutputVersionCoreObject = {
      documentType: 'Article',
      title: 'Test',
      addedDate: '2022-01-01T12:00:00.000Z',
      link: 'https://example.com',
      type: 'Blog',
    };
    test('can create a first version', async () => {
      const newVersion = {
        ...baseVersion,
        title: 'First Version',
      };
      const publish = jest.fn();
      const outputMock = getEntry({
        fields: {
          title: 'Version testing',
          versions: [],
        },
      });
      environmentMock.getEntry.mockResolvedValue(outputMock);
      environmentMock.createEntry.mockResolvedValue({
        sys: { id: '1' },
        publish,
      } as unknown as Entry);
      await outputDataProvider.update('1', getOutputUpdateDataObject(), {
        newVersion,
      });

      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'outputVersion',
        {
          fields: addLocaleToFields(newVersion),
        },
      );
    });
    test('can create a second version', async () => {
      const outputMock = getEntry({
        fields: {
          title: 'Second version test',
          versions: {
            ['en-US']: [
              getEntry(
                {
                  fields: {
                    ...baseVersion,
                    title: 'Version 1',
                  },
                },
                'version-1',
              ),
            ],
          },
        },
      });
      environmentMock.getEntry.mockResolvedValue(outputMock);
      environmentMock.createEntry.mockResolvedValue(getEntry({}, 'version-2'));

      await outputDataProvider.update('1', getOutputUpdateDataObject(), {
        newVersion: {
          ...baseVersion,
          title: 'Version 2',
        },
      });

      expect(mockPatchAndPublish).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          versions: [
            {
              sys: {
                id: 'version-1',
                linkType: 'Entry',
                type: 'Link',
              },
            },
            {
              sys: {
                id: 'version-2',
                linkType: 'Entry',
                type: 'Link',
              },
            },
          ],
        }),
      );
    });
  });
});

type Author = NonNullable<
  NonNullable<OutputItem['authorsCollection']>['items'][number]
>;
type InternalUser = Extract<Author, { __typename: 'Users' }>;
type ExternalUser = Extract<Author, { __typename: 'ExternalUsers' }>;
