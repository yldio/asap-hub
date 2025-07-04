import { GenericError, NotFoundError } from '@asap-hub/errors';
import { when } from 'jest-when';
import ResearchOutputs, {
  ERROR_UNIQUE_LINK,
} from '../../src/controllers/research-output.controller';
import { FetchResearchOutputOptions } from '../../src/data-providers/types/research-output.data-provider.types';
import {
  getResearchOutputCreateData,
  getResearchOutputCreateDataObject,
  getResearchOutputDataObject,
  getResearchOutputResponse,
  getResearchOutputUpdateData,
  getResearchOutputUpdateDataObject,
} from '../fixtures/research-output.fixtures';
import { getFullListResearchTagDataObject } from '../fixtures/research-tag.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('ResearchOutputs controller', () => {
  const researchOutputDataProviderMock = getDataProviderMock();
  const researchTagDataProviderMock = getDataProviderMock();
  const externalAuthorDataProviderMock = getDataProviderMock();
  const researchOutputs = new ResearchOutputs(
    researchOutputDataProviderMock,
    researchTagDataProviderMock,
    externalAuthorDataProviderMock,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the reserach outputs', async () => {
      researchOutputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getResearchOutputDataObject()],
      });

      const result = await researchOutputs.fetch({});

      expect(result).toEqual({
        items: [getResearchOutputResponse()],
        total: 1,
      });
    });

    test('Should return an empty list when there are no research outputs', async () => {
      researchOutputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await researchOutputs.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data provider with the correct parameters', async () => {
      researchOutputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const fetchOptions = {
        filter: { documentType: 'document-type', link: 'link', title: 'title' },
        includeDrafts: true,
        search: 'search',
        skip: 13,
        take: 7,
      };
      await researchOutputs.fetch(fetchOptions);

      const expectedFetchOptions: FetchResearchOutputOptions = fetchOptions;
      expect(researchOutputDataProviderMock.fetch).toBeCalledWith(
        expectedFetchOptions,
      );
    });

    test('Should transform an array filter into a an documentType array fetch option', async () => {
      researchOutputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const documentTypes = ['one', 'two'];
      const fetchOptions = { filter: documentTypes };
      await researchOutputs.fetch(fetchOptions);

      const expectedFetchOptions: FetchResearchOutputOptions = {
        filter: {
          documentType: documentTypes,
        },
      };
      expect(researchOutputDataProviderMock.fetch).toBeCalledWith(
        expectedFetchOptions,
      );
    });
  });

  describe('Fetch-by-ID method', () => {
    test('Should throw when research-output is not found', async () => {
      researchOutputDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(researchOutputs.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the research output when it finds it', async () => {
      researchOutputDataProviderMock.fetchById.mockResolvedValueOnce(
        getResearchOutputDataObject(),
      );
      const result = await researchOutputs.fetchById('group-id');

      expect(result).toEqual(getResearchOutputResponse());
    });
  });

  describe('Create method', () => {
    beforeEach(() => {
      researchOutputDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      researchOutputDataProviderMock.fetchById.mockResolvedValue(
        getResearchOutputDataObject(),
      );

      researchTagDataProviderMock.fetch.mockResolvedValueOnce(
        getFullListResearchTagDataObject(),
      );
    });

    test('Should throw when fails to create the research output', async () => {
      researchOutputDataProviderMock.create.mockRejectedValueOnce(
        new GenericError(),
      );

      await expect(
        researchOutputs.create(getResearchOutputCreateData()),
      ).rejects.toThrow(GenericError);
    });

    test('Should create the new research output and return it', async () => {
      const mockDate = new Date('2010-01-01');
      const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const researchOutputId = 'research-output-id-1';
      researchOutputDataProviderMock.create.mockResolvedValueOnce(
        researchOutputId,
      );

      const result = await researchOutputs.create(
        getResearchOutputCreateData(),
      );

      expect(result).toEqual(getResearchOutputResponse());
      expect(researchOutputDataProviderMock.create).toHaveBeenCalledWith(
        {
          ...getResearchOutputCreateDataObject(),
          addedDate: mockDate.toISOString(),
        },
        { publish: true },
      );
      spy.mockRestore();
    });

    test('Should create the new research output (trimmed) and return it', async () => {
      const mockDate = new Date('2010-01-01');
      const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const researchOutputId = 'research-output-id-1';
      researchOutputDataProviderMock.create.mockResolvedValueOnce(
        researchOutputId,
      );

      const researchOutputWithWhitespaces = getResearchOutputCreateData();
      researchOutputWithWhitespaces.title = ` ${researchOutputWithWhitespaces.title} `;
      researchOutputWithWhitespaces.link = ` ${researchOutputWithWhitespaces.link} `;

      const result = await researchOutputs.create(
        researchOutputWithWhitespaces,
      );

      expect(result).toEqual(getResearchOutputResponse());
      expect(researchOutputDataProviderMock.create).toBeCalledWith(
        {
          ...getResearchOutputCreateDataObject(),
          addedDate: mockDate.toISOString(),
        },
        { publish: true },
      );
      spy.mockRestore();
    });

    test('Should create a draft research output and return it', async () => {
      const researchOutputId = 'research-output-id-1';
      researchOutputDataProviderMock.create.mockResolvedValueOnce(
        researchOutputId,
      );

      const result = await researchOutputs.create({
        ...getResearchOutputCreateData(),
        published: false,
      });

      expect(result).toEqual(getResearchOutputResponse());

      expect(researchOutputDataProviderMock.create).toBeCalledWith(
        {
          ...getResearchOutputCreateDataObject(),
          addedDate: undefined,
        },
        { publish: false },
      );
    });

    describe('Validating uniqueness', () => {
      const researchOutputRequest = getResearchOutputCreateData();
      researchOutputRequest.title = 'some-test-title';
      researchOutputRequest.link = 'https://some-test-link.com';

      test('Should throw error when a research output with the same type and title already exists', async () => {
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });

        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 0,
            items: [],
          });

        await expect(
          researchOutputs.create(researchOutputRequest),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/title',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/title/unique',
              },
            ],
          }),
        );
      });

      test('Should throw error when a research output with the same type and title (trimmed) already exists', async () => {
        const researchOutputWhitespacesRequest = getResearchOutputCreateData();
        researchOutputWhitespacesRequest.title = ` ${researchOutputRequest.title} `;
        researchOutputWhitespacesRequest.link = researchOutputRequest.link;

        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });

        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 0,
            items: [],
          });

        await expect(
          researchOutputs.create(researchOutputWhitespacesRequest), // should trim the title
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/title',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/title/unique',
              },
            ],
          }),
        );
      });

      test('Should throw error when a research output with the same link already exists', async () => {
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 0,
            items: [],
          });

        await expect(
          researchOutputs.create(researchOutputRequest),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/link',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/link/unique',
              },
            ],
          }),
        );
      });

      test('Should throw error when a research output with the same link (trimmed) already exists', async () => {
        const researchOutputWhitespacesRequest = getResearchOutputCreateData();
        researchOutputWhitespacesRequest.title = researchOutputRequest.title;
        researchOutputWhitespacesRequest.link = ` ${researchOutputRequest.link} `;

        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 0,
            items: [],
          });

        await expect(
          researchOutputs.create(researchOutputWhitespacesRequest), // should trim the link
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/link',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/link/unique',
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when a research output with the same type and title and link already exists', async () => {
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });

        await expect(
          researchOutputs.create(researchOutputRequest),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/title',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/title/unique',
              },
              {
                instancePath: '/link',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/link/unique',
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when a research output with the same type and title and link (all trimmed) already exists', async () => {
        const researchOutputWhitespacesRequest = getResearchOutputCreateData();
        researchOutputWhitespacesRequest.title = ` ${researchOutputRequest.title} `;
        researchOutputWhitespacesRequest.link = ` ${researchOutputRequest.link} `;

        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });

        await expect(
          researchOutputs.create(researchOutputWhitespacesRequest), // should trim the title and link
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/title',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/title/unique',
              },
              {
                instancePath: '/link',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/link/unique',
              },
            ],
          }),
        );
      });

      describe('For document type = "Lab Material"', () => {
        const researchOutputEmptyLinkRequest = getResearchOutputCreateData();
        researchOutputEmptyLinkRequest.documentType = 'Lab Material';
        researchOutputEmptyLinkRequest.link = undefined;

        test('Should not validate the unique link condition when no link is passed', async () => {
          await researchOutputs.create(researchOutputEmptyLinkRequest);
          expect(researchOutputDataProviderMock.fetch).not.toHaveBeenCalledWith(
            {
              filter: { link: expect.any(String) },
              includeDrafts: true,
            },
          );
        });

        test('Should create the research output when no link is passed', async () => {
          await researchOutputs.create(researchOutputEmptyLinkRequest);
          expect(researchOutputDataProviderMock.create).toBeCalledWith(
            expect.objectContaining({
              link: undefined,
            }),
            { publish: true },
          );
        });
      });
    });

    describe('Parsing Research Tags', () => {
      test('Should forward the missing subtype to data provider as undefined', async () => {
        const researchOutputInputData = getResearchOutputCreateData();
        delete researchOutputInputData.subtype;

        await researchOutputs.create(researchOutputInputData);
        expect(researchOutputDataProviderMock.create).toBeCalledWith(
          expect.objectContaining({
            subtypeId: undefined,
          }),
          { publish: true },
        );
      });

      test('Should throw a validation error when the selected method does not exist', async () => {
        const researchOutputInputData = getResearchOutputCreateData();
        researchOutputInputData.methods = [
          'Activity Assay',
          'non-existent-method',
        ];

        await expect(
          researchOutputs.create(researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'methods',
                keyword: 'invalid',
                message: 'non-existent-method does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/method/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected organism does not exist', async () => {
        const researchOutputInputData = getResearchOutputCreateData();
        researchOutputInputData.organisms = ['Rat', 'non-existent-organism'];

        await expect(
          researchOutputs.create(researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'organisms',
                keyword: 'invalid',
                message: 'non-existent-organism does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/organism/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected environment does not exist', async () => {
        const researchOutputInputData = getResearchOutputCreateData();
        researchOutputInputData.environments = [
          'In Vitro',
          'non-existent-environment',
        ];

        await expect(
          researchOutputs.create(researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'environments',
                keyword: 'invalid',
                message: 'non-existent-environment does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/environment/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected subtype does not exist', async () => {
        const researchOutputInputData = getResearchOutputCreateData();
        researchOutputInputData.subtype = 'non-existent-subtype';

        await expect(
          researchOutputs.create(researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'subtype',
                keyword: 'invalid',
                message: 'non-existent-subtype does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/subtype/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected keyword does not exist', async () => {
        const researchOutputInputData = getResearchOutputCreateData();
        researchOutputInputData.keywords = ['Keyword1', 'non-existent-keyword'];

        await expect(
          researchOutputs.create(researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'keywords',
                keyword: 'invalid',
                message: 'non-existent-keyword does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/keyword/invalid`,
              },
            ],
          }),
        );
      });
    });

    describe('Authors', () => {
      test('Should throw when cannot create an external author', async () => {
        externalAuthorDataProviderMock.create.mockRejectedValueOnce(
          new GenericError(),
        );

        await expect(
          researchOutputs.create({
            ...getResearchOutputCreateData(),
            authors: [{ externalAuthorName: 'Chris Blue' }],
          }),
        ).rejects.toThrow(GenericError);
      });

      test('Should create a new external author and associate with the research-output', async () => {
        const externalAuthorId = 'external-author-id-1';
        externalAuthorDataProviderMock.create.mockResolvedValueOnce(
          externalAuthorId,
        );

        await researchOutputs.create({
          ...getResearchOutputCreateData(),
          authors: [{ externalAuthorName: 'Chris Blue' }],
        });

        expect(externalAuthorDataProviderMock.create).toBeCalledWith({
          name: 'Chris Blue',
        });
        expect(researchOutputDataProviderMock.create).toBeCalledWith(
          expect.objectContaining({
            authors: [
              {
                externalAuthorId,
              },
            ],
          }),
          { publish: true },
        );
      });
    });
  });

  describe('Update method', () => {
    const researchOutputId = 'updated-output-id';

    beforeEach(() => {
      const researchOutputDataObject = getResearchOutputDataObject();
      researchOutputDataObject.id = researchOutputId;
      researchOutputDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [researchOutputDataObject],
      });
      researchOutputDataProviderMock.fetchById.mockResolvedValue(
        getResearchOutputDataObject(),
      );

      researchTagDataProviderMock.fetch.mockResolvedValueOnce(
        getFullListResearchTagDataObject(),
      );
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('Should throw when fails to update the research output', async () => {
      researchOutputDataProviderMock.update.mockRejectedValueOnce(
        new GenericError(),
      );

      await expect(
        researchOutputs.update(researchOutputId, getResearchOutputUpdateData()),
      ).rejects.toThrow(GenericError);
    });

    test('Should throw when existing addedDate can not be retrieved from a not found research output', async () => {
      researchOutputDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(
        researchOutputs.update(researchOutputId, getResearchOutputUpdateData()),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should throw when the research output does not exist', async () => {
      researchOutputDataProviderMock.update.mockRejectedValueOnce(
        new NotFoundError(),
      );

      await expect(
        researchOutputs.update(researchOutputId, getResearchOutputUpdateData()),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should throw when trying to unpublish a published research output', async () => {
      researchOutputDataProviderMock.fetchById.mockResolvedValue({
        ...getResearchOutputDataObject(),
        published: true,
      });
      researchOutputDataProviderMock.update.mockResolvedValueOnce(
        researchOutputId,
      );

      await expect(
        researchOutputs.update(researchOutputId, {
          ...getResearchOutputUpdateData(),
          published: false,
        }),
      ).rejects.toThrow(
        expect.objectContaining({
          message: 'Cannot unpublish a research output',
        }),
      );
    });

    test('Should update a published existing research output and return it', async () => {
      researchOutputDataProviderMock.update.mockResolvedValueOnce(
        researchOutputId,
      );

      const result = await researchOutputs.update(researchOutputId, {
        ...getResearchOutputUpdateData(),
        published: true,
      });

      expect(result).toEqual(getResearchOutputResponse());
      expect(researchOutputDataProviderMock.update).toBeCalledWith(
        researchOutputId,
        { ...getResearchOutputUpdateDataObject(), versions: ['1'] },
        { publish: true },
      );
    });

    test('Should update a draft research output and return it', async () => {
      researchOutputDataProviderMock.fetchById.mockResolvedValue({
        ...getResearchOutputDataObject(),
        published: false,
        addedDate: undefined,
        statusChangedBy: {
          id: 'review-requested-by-id',
          firstName: 'First',
          lastName: 'Last',
        },
      });
      researchOutputDataProviderMock.update.mockResolvedValueOnce(
        researchOutputId,
      );

      const result = await researchOutputs.update(researchOutputId, {
        ...getResearchOutputUpdateData(),
        published: false,
        statusChangedById: 'review-requested-by-id',
      });

      expect(result).toEqual({
        ...getResearchOutputResponse(),
        published: false,
        addedDate: undefined,
        statusChangedBy: {
          id: 'review-requested-by-id',
          firstName: 'First',
          lastName: 'Last',
        },
      });

      expect(researchOutputDataProviderMock.update).toBeCalledWith(
        researchOutputId,
        {
          ...getResearchOutputUpdateDataObject(),
          versions: ['1'],
          addedDate: undefined,
          statusChangedById: 'review-requested-by-id',
        },
        { publish: false },
      );
    });

    test('Should publish a draft research output and return it', async () => {
      researchOutputDataProviderMock.fetchById.mockResolvedValue({
        ...getResearchOutputDataObject(),
        published: false,
        addedDate: undefined,
      });
      researchOutputDataProviderMock.update.mockResolvedValueOnce(
        researchOutputId,
      );

      await researchOutputs.update(researchOutputId, {
        ...getResearchOutputUpdateData(),
        published: true,
      });

      expect(researchOutputDataProviderMock.update).toBeCalledWith(
        researchOutputId,
        {
          ...getResearchOutputUpdateDataObject(),
          versions: ['1'],
          addedDate: expect.anything(),
        },

        { publish: true },
      );
    });

    describe('The added date field', () => {
      test('Should always be undefined for a draft', async () => {
        researchOutputDataProviderMock.fetchById.mockResolvedValue({
          ...getResearchOutputDataObject(),
          published: false,
          addedDate: undefined,
        });
        researchOutputDataProviderMock.update.mockResolvedValueOnce(
          researchOutputId,
        );

        await researchOutputs.update(researchOutputId, {
          ...getResearchOutputUpdateData(),
          published: false,
        });

        expect(researchOutputDataProviderMock.update).toBeCalledWith(
          researchOutputId,
          {
            ...getResearchOutputUpdateDataObject(),
            versions: ['1'],
            addedDate: undefined,
          },
          { publish: false },
        );
      });
      test('Should be created when publishing a draft', async () => {
        const mockDate = new Date('2010-01-01');
        const spy = jest
          .spyOn(global, 'Date')
          .mockImplementation(() => mockDate);
        researchOutputDataProviderMock.fetchById.mockResolvedValue({
          ...getResearchOutputDataObject(),
          published: false,
          addedDate: undefined,
        });
        researchOutputDataProviderMock.update.mockResolvedValueOnce(
          researchOutputId,
        );

        await researchOutputs.update(researchOutputId, {
          ...getResearchOutputUpdateData(),
          published: true,
        });

        expect(researchOutputDataProviderMock.update).toBeCalledWith(
          researchOutputId,
          {
            ...getResearchOutputUpdateDataObject(),
            addedDate: mockDate.toISOString(),
            versions: ['1'],
          },
          { publish: true },
        );
        spy.mockRestore();
      });

      test('Should use the existing value when updating a published output', async () => {
        researchOutputDataProviderMock.fetchById.mockResolvedValue({
          ...getResearchOutputDataObject(),
          published: true,
          addedDate: '2020-01-01',
        });
        researchOutputDataProviderMock.update.mockResolvedValueOnce(
          researchOutputId,
        );

        await researchOutputs.update(researchOutputId, {
          ...getResearchOutputUpdateData(),
          published: true,
        });

        expect(researchOutputDataProviderMock.update).toBeCalledWith(
          researchOutputId,
          {
            ...getResearchOutputUpdateDataObject(),
            addedDate: '2020-01-01',
            versions: ['1'],
          },
          { publish: true },
        );
      });
    });

    describe('Validation', () => {
      test('Should throw a validation error when the first team is removed', async () => {
        const currentResearchOutput = getResearchOutputDataObject();
        currentResearchOutput.teams = [
          { id: 'team-id-a', displayName: 'Team A' },
          { id: 'team-id-b', displayName: 'Team B' },
        ];
        researchOutputDataProviderMock.fetchById.mockResolvedValue(
          currentResearchOutput,
        );
        const researchOutputUpdateData = getResearchOutputUpdateData();
        researchOutputUpdateData.teams = ['team-id-b'];

        await expect(
          researchOutputs.update(researchOutputId, researchOutputUpdateData),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/teams',
                keyword: 'invalid',
                message: 'first team cannot be removed or changed',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/teams/invalid',
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the first team is moved down the list', async () => {
        const currentResearchOutput = getResearchOutputDataObject();
        currentResearchOutput.teams = [
          { id: 'team-id-a', displayName: 'Team A' },
          { id: 'team-id-b', displayName: 'Team B' },
        ];
        researchOutputDataProviderMock.fetchById.mockResolvedValue(
          currentResearchOutput,
        );
        const researchOutputUpdateData = getResearchOutputUpdateData();
        researchOutputUpdateData.teams = ['team-id-b', 'team-id-a'];

        await expect(
          researchOutputs.update(researchOutputId, researchOutputUpdateData),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/teams',
                keyword: 'invalid',
                message: 'first team cannot be removed or changed',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/teams/invalid',
              },
            ],
          }),
        );
      });
      describe('Validating uniqueness', () => {
        const researchOutputDataObject = getResearchOutputDataObject();
        researchOutputDataObject.id = researchOutputId;

        const researchOutputRequest = getResearchOutputUpdateData();
        researchOutputRequest.title = 'some-test-title';
        researchOutputRequest.link = 'https://some-test-link.com';

        test('Should throw an error when a different research output with the same type and title already exists', async () => {
          const otherResearchOutputDataObject = getResearchOutputDataObject();
          otherResearchOutputDataObject.id = 'another-research-output-id';
          // returns this research output and another one with the same type and title
          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: {
                title: researchOutputRequest.title,
                documentType: researchOutputRequest.documentType,
              },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [researchOutputDataObject, otherResearchOutputDataObject],
            });
          // returns this research output only
          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: { link: researchOutputRequest.link },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 1,
              items: [researchOutputDataObject],
            });

          await expect(
            researchOutputs.update(researchOutputId, researchOutputRequest),
          ).rejects.toThrow(
            expect.objectContaining({
              data: [
                {
                  instancePath: '/title',
                  keyword: 'unique',
                  message: 'must be unique',
                  params: {
                    type: 'string',
                  },
                  schemaPath: '#/properties/title/unique',
                },
              ],
            }),
          );
        });

        test('Should throw an error when a different research output with the same type and title (trimmed) already exists', async () => {
          const otherResearchOutputDataObject = getResearchOutputDataObject();
          otherResearchOutputDataObject.id = 'another-research-output-id';

          const researchOutputWhitespacesRequest = {
            ...researchOutputRequest,
            title: ` ${researchOutputRequest.title} `,
          };

          // returns this research output and another one with the same type and title
          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: {
                title: researchOutputRequest.title,
                documentType: researchOutputRequest.documentType,
              },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [researchOutputDataObject, otherResearchOutputDataObject],
            });
          // returns this research output only
          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: { link: researchOutputRequest.link },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 1,
              items: [researchOutputDataObject],
            });

          await expect(
            researchOutputs.update(
              researchOutputId,
              researchOutputWhitespacesRequest,
            ),
          ).rejects.toThrow(
            expect.objectContaining({
              data: [
                {
                  instancePath: '/title',
                  keyword: 'unique',
                  message: 'must be unique',
                  params: {
                    type: 'string',
                  },
                  schemaPath: '#/properties/title/unique',
                },
              ],
            }),
          );
        });

        test('Should throw error when a research output with the same link already exists', async () => {
          const otherResearchOutputDataObject = getResearchOutputDataObject();
          otherResearchOutputDataObject.id = 'another-research-output-id';
          // returns this research output and another one with the link
          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: { link: researchOutputRequest.link },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [researchOutputDataObject, otherResearchOutputDataObject],
            });

          // returns this research output only
          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: {
                title: researchOutputRequest.title,
                documentType: researchOutputRequest.documentType,
              },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 1,
              items: [researchOutputDataObject],
            });

          await expect(
            researchOutputs.update(researchOutputId, researchOutputRequest),
          ).rejects.toThrow(
            expect.objectContaining({
              data: [
                {
                  instancePath: '/link',
                  keyword: 'unique',
                  message: 'must be unique',
                  params: {
                    type: 'string',
                  },
                  schemaPath: '#/properties/link/unique',
                },
              ],
            }),
          );
        });

        test('Should throw error when a research output with the same link (trimmed) already exists', async () => {
          const otherResearchOutputDataObject = getResearchOutputDataObject();
          otherResearchOutputDataObject.id = 'another-research-output-id';

          const researchOutputWhitespacesRequest = {
            ...researchOutputRequest,
            link: ` ${researchOutputRequest.link} `,
          };

          // returns this research output and another one with the link
          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: { link: researchOutputRequest.link },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [researchOutputDataObject, otherResearchOutputDataObject],
            });

          // returns this research output only
          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: {
                title: researchOutputRequest.title,
                documentType: researchOutputRequest.documentType,
              },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 1,
              items: [researchOutputDataObject],
            });

          await expect(
            researchOutputs.update(
              researchOutputId,
              researchOutputWhitespacesRequest,
            ),
          ).rejects.toThrow(
            expect.objectContaining({
              data: [
                {
                  instancePath: '/link',
                  keyword: 'unique',
                  message: 'must be unique',
                  params: {
                    type: 'string',
                  },
                  schemaPath: '#/properties/link/unique',
                },
              ],
            }),
          );
        });

        test('Should throw two validation errors when a research output with the same type and title and link already exists', async () => {
          const otherResearchOutputDataObject = getResearchOutputDataObject();
          otherResearchOutputDataObject.id = 'another-research-output-id';
          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: {
                title: researchOutputRequest.title,
                documentType: researchOutputRequest.documentType,
              },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [researchOutputDataObject, otherResearchOutputDataObject],
            });
          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: { link: researchOutputRequest.link },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [researchOutputDataObject, otherResearchOutputDataObject],
            });

          await expect(
            researchOutputs.update(researchOutputId, researchOutputRequest),
          ).rejects.toThrow(
            expect.objectContaining({
              data: [
                {
                  instancePath: '/title',
                  keyword: 'unique',
                  message: 'must be unique',
                  params: {
                    type: 'string',
                  },
                  schemaPath: '#/properties/title/unique',
                },
                {
                  instancePath: '/link',
                  keyword: 'unique',
                  message: 'must be unique',
                  params: {
                    type: 'string',
                  },
                  schemaPath: '#/properties/link/unique',
                },
              ],
            }),
          );
        });

        test('Should throw two validation errors when a research output with the same type and title and link (all trimmed) already exists', async () => {
          const otherResearchOutputDataObject = getResearchOutputDataObject();
          otherResearchOutputDataObject.id = 'another-research-output-id';

          const researchOutputWhitespacesRequest = {
            ...researchOutputRequest,
            title: ` ${researchOutputRequest.title} `,
            link: ` ${researchOutputRequest.link} `,
          };

          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: {
                title: researchOutputRequest.title,
                documentType: researchOutputRequest.documentType,
              },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [researchOutputDataObject, otherResearchOutputDataObject],
            });
          when(researchOutputDataProviderMock.fetch)
            .calledWith({
              filter: { link: researchOutputRequest.link },
              includeDrafts: true,
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [researchOutputDataObject, otherResearchOutputDataObject],
            });

          await expect(
            researchOutputs.update(
              researchOutputId,
              researchOutputWhitespacesRequest,
            ),
          ).rejects.toThrow(
            expect.objectContaining({
              data: [
                {
                  instancePath: '/title',
                  keyword: 'unique',
                  message: 'must be unique',
                  params: {
                    type: 'string',
                  },
                  schemaPath: '#/properties/title/unique',
                },
                {
                  instancePath: '/link',
                  keyword: 'unique',
                  message: 'must be unique',
                  params: {
                    type: 'string',
                  },
                  schemaPath: '#/properties/link/unique',
                },
              ],
            }),
          );
        });
      });
    });

    describe('Parsing Research Tags', () => {
      test('Should throw a validation error when the selected method does not exist', async () => {
        const researchOutputInputData = getResearchOutputUpdateData();
        researchOutputInputData.methods = [
          'Activity Assay',
          'non-existent-method',
        ];

        await expect(
          researchOutputs.update(researchOutputId, researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'methods',
                keyword: 'invalid',
                message: 'non-existent-method does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/method/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected organism does not exist', async () => {
        const researchOutputInputData = getResearchOutputUpdateData();
        researchOutputInputData.organisms = ['Rat', 'non-existent-organism'];

        await expect(
          researchOutputs.update(researchOutputId, researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'organisms',
                keyword: 'invalid',
                message: 'non-existent-organism does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/organism/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected environment does not exist', async () => {
        const researchOutputInputData = getResearchOutputUpdateData();
        researchOutputInputData.environments = [
          'In Vitro',
          'non-existent-environment',
        ];

        await expect(
          researchOutputs.update(researchOutputId, researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'environments',
                keyword: 'invalid',
                message: 'non-existent-environment does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/environment/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected subtype does not exist', async () => {
        const researchOutputInputData = getResearchOutputUpdateData();
        researchOutputInputData.subtype = 'non-existent-subtype';

        await expect(
          researchOutputs.update(researchOutputId, researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'subtype',
                keyword: 'invalid',
                message: 'non-existent-subtype does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/subtype/invalid`,
              },
            ],
          }),
        );
      });
    });

    describe('Authors', () => {
      test('Should throw when cannot create an external author', async () => {
        externalAuthorDataProviderMock.create.mockRejectedValueOnce(
          new GenericError(),
        );

        await expect(
          researchOutputs.update(researchOutputId, {
            ...getResearchOutputUpdateData(),
            authors: [{ externalAuthorName: 'Chris Blue' }],
          }),
        ).rejects.toThrow(GenericError);
      });

      test('Should create a new external author and associate with the research-output', async () => {
        const externalAuthorId = 'external-author-id-1';
        externalAuthorDataProviderMock.create.mockResolvedValueOnce(
          externalAuthorId,
        );

        await researchOutputs.update(researchOutputId, {
          ...getResearchOutputUpdateData(),
          authors: [{ externalAuthorName: 'Chris Blue' }],
        });

        expect(externalAuthorDataProviderMock.create).toBeCalledWith({
          name: 'Chris Blue',
        });
        expect(researchOutputDataProviderMock.update).toBeCalledWith(
          researchOutputId,
          expect.objectContaining({
            authors: [
              {
                externalAuthorId,
              },
            ],
          }),
          { publish: true },
        );
      });
    });

    test('Should create a new version when flag is set', async () => {
      const doi = '10.555/YFRU1371.121212';
      const rrid = 'RRID:AB_007358';
      const accession = 'NT_123456';

      const currentResearchOutput = getResearchOutputDataObject();
      currentResearchOutput.doi = doi;
      currentResearchOutput.rrid = rrid;
      currentResearchOutput.accession = accession;
      researchOutputDataProviderMock.fetchById.mockResolvedValueOnce(
        currentResearchOutput,
      );

      researchOutputDataProviderMock.update.mockResolvedValueOnce(
        researchOutputId,
      );

      await researchOutputs.update(researchOutputId, {
        ...getResearchOutputUpdateData(),
        createVersion: true,
        link: 'https://newUniqueLink.com',
        title: 'new title',
        doi,
        rrid,
        accession,
      });

      expect(researchOutputDataProviderMock.update).toBeCalledWith(
        researchOutputId,
        expect.anything(),
        {
          newVersion: {
            documentType: 'Lab Material',
            link: undefined,
            title: 'Test Proposal 1234',
            type: '3D Printing',
            addedDate: '2021-05-21T13:18:31Z',
            doi,
            rrid,
            accession,
          },
          publish: true,
        },
      );
    });

    test('Should throw when trying to create a new version with the same link', async () => {
      const currentResearchOutput = getResearchOutputDataObject();
      const researchOutputUpdateData = getResearchOutputUpdateData();

      currentResearchOutput.link = 'http://v1.com';
      researchOutputDataProviderMock.fetchById.mockResolvedValue(
        currentResearchOutput,
      );

      await expect(
        researchOutputs.update(researchOutputId, {
          ...researchOutputUpdateData,
          createVersion: true,
          link: 'http://v1.com',
          title: 'new title',
        }),
      ).rejects.toThrow(
        expect.objectContaining({
          data: [ERROR_UNIQUE_LINK],
        }),
      );
    });
  });
});
