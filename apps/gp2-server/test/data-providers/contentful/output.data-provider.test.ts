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
import {
  OutputContentfulDataProvider,
  OutputItem,
} from '../../../src/data-providers/contentful/output.data-provider';
import { OutputDataProvider } from '../../../src/data-providers/types';
import { getEntry } from '../../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlOutput,
  getContentfulOutputsGraphqlResponse,
  getListOutputDataObject,
  getOutputCreateDataObject,
  getOutputDataObject,
  getOutputUpdateDataObject,
} from '../../fixtures/output.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';
jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  patchAndPublish: jest.fn().mockResolvedValue(undefined),
}));

describe('Outputs data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const outputDataProvider: OutputDataProvider =
    new OutputContentfulDataProvider(
      contentfulGraphqlClientMock,
      contentfulRestClientMock,
    );
  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      Outputs: () => getContentfulGraphqlOutput(),
    });
  const outputDataProviderWithMockServer: OutputDataProvider =
    new OutputContentfulDataProvider(
      contentfulGraphqlClientMockServer,
      contentfulRestClientMock,
    );

  beforeEach(jest.resetAllMocks);

  describe('Fetch by ID method', () => {
    const outputId = 'some-uuid';

    test('Should fetch the output from graphql', async () => {
      const result = await outputDataProviderWithMockServer.fetchById(outputId);

      expect(result).toMatchObject(getOutputDataObject());
    });
    test('Should return null when the output is not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        outputs: null,
      });

      expect(await outputDataProvider.fetchById('not-found')).toBeNull();
    });

    test('should return the output', async () => {
      const graphqlResponse = getContentfulGraphqlOutput();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        outputs: graphqlResponse,
      });

      const result = await outputDataProvider.fetchById(outputId);
      const expectedResult = getOutputDataObject();

      expect(result).toEqual(expectedResult);
    });

    describe('Document Types', () => {
      test('should return when the document type is null', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlResponse!.documentType = null;
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        await expect(outputDataProvider.fetchById(outputId)).rejects.toThrow(
          'document type not defined',
        );
      });
      test.each(gp2Model.outputDocumentTypes)(
        'parses the document type %s to %s',
        async (type) => {
          const graphqlResponse = getContentfulGraphqlOutput();
          graphqlResponse!.documentType = type;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            outputs: graphqlResponse,
          });
          const result = await outputDataProvider.fetchById(outputId);
          expect(result?.documentType).toEqual(type);
        },
      );
    });
    describe('Types', () => {
      test('should throw when the type is null', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlResponse!.documentType = 'Article';
        graphqlResponse!.type = null;
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        await expect(outputDataProvider.fetchById(outputId)).rejects.toThrow(
          'type not defined',
        );
      });
      test.each(gp2Model.outputTypes)(
        'parses the  type %s to %s',
        async (type) => {
          const graphqlResponse = getContentfulGraphqlOutput();
          graphqlResponse!.documentType = 'Article';
          graphqlResponse!.type = type;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
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
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
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
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });
        const result = await outputDataProvider.fetchById(outputId);
        expect(result?.subtype).toEqual(type);
      },
    );

    test('Should default authors to an empty array when missing', async () => {
      const graphqlResponse = getContentfulGraphqlOutput();
      graphqlResponse!.authorsCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        outputs: graphqlResponse,
      });

      const result = await outputDataProvider.fetchById(outputId);

      expect(result!.authors).toEqual([]);
    });

    describe('Authors', () => {
      const getInternalUsers = (): InternalUser[] => [
        {
          sys: { id: 'user-id-1' },
          firstName: 'Tony',
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
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
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
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
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
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
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
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
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
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });

        const result = await outputDataProvider.fetchById(outputId);

        expect(result!.lastUpdatedPartial).toEqual(
          graphqlResponse!.sys.firstPublishedAt,
        );
      });
    });
    describe('working groups', () => {
      it('should return undefined if theres no working group', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlResponse!.relatedEntity = {
          __typename: 'Projects',
          sys: {
            id: '42',
          },
          title: 'a project',
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });
        const result = await outputDataProvider.fetchById(outputId);

        expect(result!.workingGroup).toBeUndefined();
        expect(result!.project).toEqual({
          id: '42',
          title: 'a project',
        });
      });
    });
    describe('projects', () => {
      it('should return undefined if theres no project', async () => {
        const graphqlResponse = getContentfulGraphqlOutput();
        graphqlResponse!.relatedEntity = {
          __typename: 'WorkingGroups',
          sys: {
            id: '42',
          },
          title: 'a working group',
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          outputs: graphqlResponse,
        });
        const result = await outputDataProvider.fetchById(outputId);

        expect(result!.project).toBeUndefined();
        expect(result!.workingGroup).toEqual({
          id: '42',
          title: 'a working group',
        });
      });
    });
  });

  describe('Fetch method', () => {
    test('Should fetch the output from graphql', async () => {
      const result = await outputDataProviderWithMockServer.fetch({});

      expect(result).toMatchObject(getListOutputDataObject());
    });

    test('Should return an empty result when the client returns an empty array of data', async () => {
      const graphqlResponse = getContentfulOutputsGraphqlResponse();
      graphqlResponse.outputsCollection!.total = 0;
      graphqlResponse.outputsCollection!.items = [];
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        graphqlResponse,
      );

      const result = await outputDataProvider.fetch({
        take: 10,
        skip: 5,
      });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const graphqlResponse = getContentfulOutputsGraphqlResponse();
      graphqlResponse.outputsCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        graphqlResponse,
      );

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
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          graphqlResponse,
        );

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
        preview: false,
        order: [gp2Contentful.OutputsOrder.PublishDateDesc],
      };

      beforeEach(() => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulOutputsGraphqlResponse(),
        );
      });

      test('Should pass the pagination parameters as expected', async () => {
        await outputDataProvider.fetch({ take: 13, skip: 7 });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            limit: 13,
            skip: 7,
          },
        );
      });

      test('Should allow for draft outputs to be returned', async () => {
        await outputDataProvider.fetch({
          take: 13,
          skip: 7,
          includeDrafts: true,
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            limit: 13,
            skip: 7,
            preview: true,
          },
        );
      });

      test('Should pass the search parameters', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          search: 'Title',
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
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
            documentType: 'some-type',
            title: 'some-title',
          },
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            where: {
              AND: [{ title: 'some-title' }, { documentType: 'some-type' }],
            },
          },
        );
      });

      test('Should pass the object filter parameter properties with an array', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          filter: {
            documentType: ['some-type-1', 'some-type-2'],
            title: 'some-title',
          },
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            where: {
              AND: [
                { title: 'some-title' },
                { documentType_in: ['some-type-1', 'some-type-2'] },
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
            documentType: ['Grant Document', 'Presentation'],
          },
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS,
          {
            ...expectedDefaultParams,
            where: {
              AND: [
                { OR: [{ title_contains: 'Title' }] },
                { documentType_in: ['Grant Document', 'Presentation'] },
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

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
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

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
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
            workingGroup: 'working-group-id',
          },
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
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
            project: 'project-id',
          },
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS_BY_PROJECT_ID,
          {
            limit: 8,
            skip: 0,
            id: 'project-id',
          },
        );
      });
      test('filter by authors', async () => {
        await outputDataProvider.fetch({
          ...defaultParams,
          filter: {
            author: 'user-id',
          },
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_OUTPUTS_BY_USER_ID,
          {
            limit: 8,
            skip: 0,
            id: 'user-id',
          },
        );
      });
    });
  });

  describe('Create and update', () => {
    describe('Create', () => {
      test('Should send the correct requests and return its ID', async () => {
        const outputRequest = getOutputCreateDataObject();
        const outputId = 'created-output-id';

        const outputMock = getEntry({}, outputId);
        environmentMock.createEntry.mockResolvedValue(outputMock);
        outputMock.publish = jest.fn().mockResolvedValueOnce(outputMock);

        const result = await outputDataProvider.create(outputRequest);
        expect(result).toEqual(outputId);
        const { publishDate: _, ...fieldsCreated } = outputRequest;
        const fields = addLocaleToFields({
          ...fieldsCreated,
          authors: fieldsCreated.authors.map(
            (author) => author.externalUserId || author.userId,
          ),
          updatedBy: outputRequest.createdBy,
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
            authors: { 'en-US': ['some-external-user-id', 'some-user-id'] },
          }),
        });
      });

      test('Should throw when fails to create the output', async () => {
        const OutputRequest = getOutputCreateDataObject();
        environmentMock.createEntry.mockRejectedValueOnce(new GenericError());

        await expect(outputDataProvider.create(OutputRequest)).rejects.toThrow(
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
        contentfulGraphqlClientMock.request.mockResolvedValue({
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
        const { publishDate: _, ...fieldsCreated } = outputUpdateData;
        const fields = addLocaleToFields({
          ...fieldsCreated,
          authors: fieldsCreated.authors.map(
            (author) => author.externalUserId || author.userId,
          ),
        });
        expect(patchAndPublish).toHaveBeenCalledWith(entry, {
          ...fields,
        });
        expect(environmentMock.createEntry).toBeCalledTimes(0);
        expect(environmentMock.createPublishBulkAction).not.toBeCalled();
        expect(environmentMock.createUnpublishBulkAction).not.toBeCalled();
        expect(environmentMock.getEntries).not.toBeCalled();
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
  });
});

type Author = NonNullable<
  NonNullable<OutputItem['authorsCollection']>['items'][number]
>;
type InternalUser = Extract<Author, { __typename: 'Users' }>;
type ExternalUser = Extract<Author, { __typename: 'ExternalUsers' }>;
